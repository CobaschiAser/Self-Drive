package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.dtos.AppUserEditDto;
import com.example.webjpademoapplicationsecondtry.dtos.AppUserRegisterDto;
import com.example.webjpademoapplicationsecondtry.dtos.ForgetPasswordDto;
import com.example.webjpademoapplicationsecondtry.dtos.VerifyEmailDto;
import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.security.PasswordHashing;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface AppUserService {
    public List<AppUser> findAllUser();

    public AppUser findUserById(UUID id);

    // public Optional<User> findUserByToken(String token);
    public AppUser findUserByEmail(String email);

    public AppUser findUserByUsername(String username);

    public ResponseEntity<Set<Request>> findUserRequests(UUID userId);

    public ResponseEntity<Set<Ride>> findUserRides(UUID userId);

    public ResponseEntity<AppUser> login(String username, String password, PasswordHashing passwordHashing);

    public ResponseEntity<String> saveUser(AppUserRegisterDto appUser, PasswordHashing passwordHashing, EmailService emailService);

    public ResponseEntity<AppUser> updateUser(AppUserEditDto appUserEditDto, UUID id, PasswordHashing passwordHashing);

    public ResponseEntity<String> verifyUserEmail(VerifyEmailDto verifyEmailDto);

    public ResponseEntity<String> resetPassword(ForgetPasswordDto forgetPasswordDto, PasswordHashing passwordHashing);

    public ResponseEntity<String> sendResetPasswordCode(String email, EmailService emailService);
    public void deleteUserById(UUID id, RequestService requestService);
}
