package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.dtos.*;
import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.security.PasswordHashing;
import com.example.webjpademoapplicationsecondtry.service.EmailService;
import com.example.webjpademoapplicationsecondtry.service.RequestService;
import com.example.webjpademoapplicationsecondtry.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class AppUserController {
    private final AppUserService appUserService;

    private final PasswordHashing passwordHashing;

    private final RequestService requestService;

    private final EmailService emailService;

    @Autowired
    public AppUserController(AppUserService appUserService, PasswordHashing passwordHashing, RequestService requestService, EmailService emailService) {
        this.appUserService = appUserService;
        this.passwordHashing = passwordHashing;
        this.requestService = requestService;
        this.emailService = emailService;
    }

    @GetMapping
    public List<AppUser> findAllUser(){
        return appUserService.findAllUser();
    }

    @GetMapping("/{id}")
    public AppUser findUserById(@PathVariable("id") UUID id){
        return appUserService.findUserById(id);
    }

    @GetMapping("/{id}/request")
    public ResponseEntity<Set<Request>> findUserRequests(@PathVariable("id") UUID id){
        return appUserService.findUserRequests(id);
    }

    @GetMapping("/{id}/ride")
    public ResponseEntity<Set<Ride>> findUserRides(@PathVariable("id") UUID id){
        return appUserService.findUserRides(id);
    }
    @PostMapping()
    public ResponseEntity<String> saveUser(@RequestBody AppUserRegisterDto appUser){
        return appUserService.saveUser(appUser, passwordHashing, emailService);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyUserEmail(@RequestBody VerifyEmailDto verifyEmailDto){
        return appUserService.verifyUserEmail(verifyEmailDto);
    }

    @PostMapping("/send-reset-password-code")
    public ResponseEntity<String> sendResetPasswordCode(@RequestBody String email){
        return appUserService.sendResetPasswordCode(email, emailService);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String>  forgetPassword(@RequestBody ForgetPasswordDto forgetPasswordDto){
        return appUserService.resetPassword(forgetPasswordDto, passwordHashing);
    }

    @PostMapping("/login")
    public ResponseEntity<AppUser> login(@RequestBody AppUserLoginDto userLoginDto){
        return appUserService.login(userLoginDto.getUsername(), userLoginDto.getPassword(), passwordHashing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@RequestBody AppUserEditDto appUserEditDto, @PathVariable("id")UUID id){
        return appUserService.updateUser(appUserEditDto, id,passwordHashing);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") UUID id){
        appUserService.deleteUserById(id, requestService);
    }

}
