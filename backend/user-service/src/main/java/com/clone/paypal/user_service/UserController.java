package com.clone.paypal.user_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject the password encoder

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // New Login DTO (Data Transfer Object)
    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.password, user.getPassword())) {
                // For now, return a simple placeholder token. In a real app, this would be a securely generated JWT.
                return ResponseEntity.ok(new LoginResponse("dummy-jwt-token-for-" + user.getId(), user.getId(), user.getName()));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

        @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<User> getAuthenticatedUser(@RequestHeader("Authorization") String authorizationHeader) {
        // In a real application, you would validate the JWT and extract user information.
        // For this example, we're extracting the user ID from our dummy token.
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer dummy-jwt-token-for-")) {
            try {
                Long userId = Long.parseLong(authorizationHeader.substring("Bearer dummy-jwt-token-for-".length()));
                Optional<User> userOptional = userRepository.findById(userId);
                return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}