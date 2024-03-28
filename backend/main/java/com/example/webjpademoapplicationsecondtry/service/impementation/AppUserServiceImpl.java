package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.dtos.AppUserEditDto;
import com.example.webjpademoapplicationsecondtry.dtos.AppUserRegisterDto;
import com.example.webjpademoapplicationsecondtry.dtos.ForgetPasswordDto;
import com.example.webjpademoapplicationsecondtry.dtos.VerifyEmailDto;
import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.exception.AlreadyExistsException;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.repository.AppUserRepository;
import com.example.webjpademoapplicationsecondtry.security.PasswordHashing;
import com.example.webjpademoapplicationsecondtry.service.EmailService;
import com.example.webjpademoapplicationsecondtry.service.RequestService;
import com.example.webjpademoapplicationsecondtry.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class AppUserServiceImpl implements AppUserService {
    private final AppUserRepository appUserRepository;

    @Autowired
    public AppUserServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }


    @Override
    public List<AppUser> findAllUser() {

        if(appUserRepository.findAll().isEmpty()) {
            throw  new NotFoundException("Sorry. There is no user in system");
        }
        return appUserRepository.findAll();
    }

    @Override
    public AppUser findUserById(UUID id) {
        return appUserRepository.findById(id).orElseThrow(
                () ->new NotFoundException("There is no user with id: " + id)
        );
    }

    @Override
    public AppUser findUserByEmail(String email){
        AppUser appUserToFind = appUserRepository.findUserByEmail(email);
        if(appUserToFind == null) {
            throw new NotFoundException("There is no user with email addres: " + email);
        }
        return appUserToFind;
    }

    @Override
    public AppUser findUserByUsername(String username){
        AppUser appUserToFind = appUserRepository.findUserByUsername(username);
        if(appUserToFind == null) {
            throw new NotFoundException("There is no user with username: " + username);
        }
        return appUserToFind;
    }

    @Override
    public ResponseEntity<Set<Request>> findUserRequests(UUID uuid){
        AppUser appUser = appUserRepository.findById(uuid).orElseThrow(
                () -> new NotFoundException("There is no user with id: " + uuid)
        );
        if(appUser.getRequests().isEmpty()){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(appUser.getRequests(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Set<Ride>> findUserRides(UUID uuid) {
        AppUser appUser = appUserRepository.findById(uuid).orElseThrow(
                () -> new NotFoundException("There is no user with id: " + uuid)
        );
        if(appUser.getRides().isEmpty()){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(appUser.getRides(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<AppUser> login(String username, String password, PasswordHashing passwordHashing){
        try {
            String salt = appUserRepository.getSalt(username);
            AppUser appUser = null;
            if (salt != null) {
                appUser = appUserRepository.login(username, passwordHashing.hashString(password, salt));
            }
            if (appUser != null) {
                if (appUser.getVerificated()) {
                    UUID token = UUID.randomUUID();
                    appUser.setAuthenticationToken(token);
                    appUserRepository.save(appUser);
                    return new ResponseEntity<>(appUser, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(null, HttpStatus.LOCKED);
                }
            }
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*@Override
    public Optional<User> findUserByToken(String token){
        Optional<AppUser> appUser = appUserRepository.findUserByAuthenticationToken(UUID.fromString(token));
        if(appUser.isPresent() ){
            AppUser appUser1 = appUser.get();
            User user = new User(appUser1.getUsername(), appUser1.getPassword(), true, true,
                    true, true, AuthorityUtils.createAuthorityList("USER"));
            return Optional.of(user);
        }
        return  null;
    }

     */

    @Override
    public ResponseEntity<String>  resetPassword(ForgetPasswordDto forgetPasswordDto, PasswordHashing passwordHashing){
        String email = forgetPasswordDto.getEmail();
        String newPassword = forgetPasswordDto.getNewPassword();
        String resetPasswordCode = forgetPasswordDto.getResetPasswordCode();
        AppUser appUser = appUserRepository.findUserByEmail(email);
        if (appUser == null) {
            return new ResponseEntity<>("401 Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!appUser.getVerificated()) {
            return new ResponseEntity<>("405 Method Not Allowed", HttpStatus.METHOD_NOT_ALLOWED);
        }
        if (appUser.getPasswordCode() == null) {
            return new ResponseEntity<>("404 Not Found.", HttpStatus.NOT_FOUND);
        }
        if (appUser.getPasswordCode().compareTo(resetPasswordCode) != 0) {
            return new ResponseEntity<>("409 Conflict.", HttpStatus.CONFLICT);
        }
        try {
            appUser.setPassword(passwordHashing.hashString(newPassword, appUser.getSalt()));
            appUser.setPasswordCode(null);
            appUserRepository.save(appUser);
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<String> sendResetPasswordCode(String email, EmailService emailService){
        email = email.replace("\"", "");
        System.out.println(email);
        AppUser appUser = appUserRepository.findUserByEmail(email);
        if (appUser == null) {
            return new ResponseEntity<>("401 Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!appUser.getVerificated()) {
            return new ResponseEntity<>("409 Conflict.", HttpStatus.CONFLICT);
        }
        // generate passwordCode;
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            sb.append(random.nextInt(10));
        }
        String randomString = sb.toString();
        appUser.setPasswordCode(randomString);
        this.appUserRepository.save(appUser);

        // send email with password code to user
        String body = "In order to reset your password, please introduce this password code in specified section. \n " +
                "Password code is:" + "  " + appUser.getPasswordCode();
        String subject = "RESET PASSWORD CODE";
        emailService.sendEmail(email, subject, body);
        return new ResponseEntity<>("Password code successfully sent", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> verifyUserEmail(VerifyEmailDto verifyEmailDto){
        String email = verifyEmailDto.getEmail();
        String verificationCode = verifyEmailDto.getVerificationCode();

        AppUser appUser = appUserRepository.findUserByEmail(email);
        if (appUser == null) {
            return new ResponseEntity<>("No user with given email", HttpStatus.UNAUTHORIZED);
        }
        if (appUser.getVerificated()) {
            return new ResponseEntity<>("Already verified", HttpStatus.CONFLICT);
        }
        if (appUser.getVerificationCode().compareTo(verificationCode) != 0) {
            return new ResponseEntity<>("Incorrect verification code", HttpStatus.NOT_FOUND);
        }
        // verify email
        appUser.setVerificated(true);
        this.appUserRepository.save(appUser);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> saveUser(AppUserRegisterDto appUserRegisterDto, PasswordHashing passwordHashing, EmailService emailService) {
        try {
            AppUser byUsername = appUserRepository.findUserByUsername(appUserRegisterDto.getUsername());
            AppUser byEmail = appUserRepository.findUserByEmail(appUserRegisterDto.getEmail());
            if(byUsername != null || byEmail != null) {
                return new ResponseEntity<>("Invalid username or email address", HttpStatus.CONFLICT);
            }
            AppUser appUser = new AppUser(appUserRegisterDto);
            // set salt and password
            appUser.setSalt(passwordHashing.generateSalt());
            appUser.setPassword(passwordHashing.hashString(appUser.getPassword(), appUser.getSalt()));
            // set verification code - 5 random digits
            Random random = new Random();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 5; i++) {
                sb.append(random.nextInt(10));
            }
            String randomString = sb.toString();
            appUser.setVerificationCode(randomString);
            // save the user
            System.out.println(appUser.getVerificationCode());
            appUserRepository.save(appUser);
            System.out.println("Successfully saved user");


            // send verification code by email
            String body = "We are so happy you chose to use out App. Please introduce this verification code in specified section. \n " +
                    "Verification code is:" + "  " + appUser.getVerificationCode();
            String subject = "EMAIL VERIFICATION";
            emailService.sendEmail(appUser.getEmail(), subject, body);

            return new ResponseEntity<>("User successfully Created", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Override
    public ResponseEntity<AppUser> updateUser(AppUserEditDto appUserEditDto, UUID id, PasswordHashing passwordHashing) { // make it in function of id
        System.out.println("Hello");
        try {
            System.out.println("inside try");
            AppUser toModifyAppUser = appUserRepository.findUserById(id);
            System.out.println("toModifyUser");
            if(toModifyAppUser == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            System.out.println("Found");
            AppUser byEmail = appUserRepository.findUserByEmail(appUserEditDto.getEmail());
            if(byEmail != null && byEmail != toModifyAppUser){
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            AppUser byUsername = appUserRepository.findUserByUsername(appUserEditDto.getUsername());
            if(byUsername != null && byUsername != toModifyAppUser){
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            // set toModifyUser according to new attributes value
            toModifyAppUser.setName(appUserEditDto.getName());
            toModifyAppUser.setEmail(appUserEditDto.getEmail());
            toModifyAppUser.setUsername(appUserEditDto.getUsername());
            System.out.println("Before save");
            AppUser modifiedUser = appUserRepository.save(toModifyAppUser);
            System.out.println("After save");
            return new ResponseEntity<>(modifiedUser, HttpStatus.OK);
        }catch(Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteUserById(UUID id, RequestService requestService) {
        AppUser appUser = appUserRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Cannot make delete operation. No user with id: " + id)
        ); // firstly check out if there is any user with given id
        // then we delete requests associated with him

        // BUG HERE:
        // eroare cand sterg din setul peste care iterez
        // UPDATE: FIXED
        Set<Request> copyRequests = new HashSet<>(appUser.getRequests());
        for(Request r : copyRequests) {
            //if(!r.getSolved()) {
              //  System.out.println("I'm here");
               // requestService.safeDeleteRequest(r.getId());
           // }else {
             //   System.out.println("I AM HERE");
              //  requestService.deleteOnlyRequest(r.getId());
            //}
            requestService.deleteOnlyRequest(r.getId());
        }
        appUserRepository.deleteById(id);
    }
}
