package com.smartbudget.controller;

import com.smartbudget.dto.ProfileUpdateRequest;
import com.smartbudget.dto.UserDTO;
import com.smartbudget.dto.UserProfileDTO;
import com.smartbudget.security.UserPrincipal;
import com.smartbudget.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(userService.getUserProfile(currentUser.getId()));
    }

    @PutMapping
    public ResponseEntity<UserDTO> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                 @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), request));
    }
}
