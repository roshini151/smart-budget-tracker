package com.smartbudget.service;

import com.smartbudget.dto.ProfileUpdateRequest;
import com.smartbudget.dto.UserDTO;
import com.smartbudget.dto.UserProfileDTO;
import com.smartbudget.entity.User;
import com.smartbudget.exception.DuplicateResourceException;
import com.smartbudget.exception.ResourceNotFoundException;
import com.smartbudget.repository.ExpenseRepository;
import com.smartbudget.repository.IncomeRepository;
import com.smartbudget.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public UserService(UserRepository userRepository,
                       IncomeRepository incomeRepository,
                       ExpenseRepository expenseRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
    }

    public User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public UserProfileDTO getUserProfile(Long userId) {
        User user = getUserEntity(userId);
        BigDecimal totalIncome = incomeRepository.sumTotalByUserId(userId);
        BigDecimal totalExpenses = expenseRepository.sumTotalByUserId(userId);
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        UserProfileDTO profile = new UserProfileDTO();
        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setCurrency(user.getCurrency());
        profile.setMonthlyIncomePreference(user.getMonthlyIncomePreference());
        profile.setTotalIncome(totalIncome);
        profile.setTotalExpenses(totalExpenses);
        profile.setTotalBalance(balance);

        return profile;
    }

    @Transactional
    public UserDTO updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = getUserEntity(userId);

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email " + request.getEmail() + " is already in use.");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setCurrency(request.getCurrency());
        if (request.getMonthlyIncomePreference() != null) {
            user.setMonthlyIncomePreference(request.getMonthlyIncomePreference());
        }

        User updated = userRepository.save(user);
        return new UserDTO(updated.getId(), updated.getName(), updated.getEmail(), updated.getCurrency(), updated.getMonthlyIncomePreference());
    }
}
