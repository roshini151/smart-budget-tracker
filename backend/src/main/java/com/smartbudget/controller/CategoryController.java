package com.smartbudget.controller;

import com.smartbudget.dto.CategoryDTO;
import com.smartbudget.security.UserPrincipal;
import com.smartbudget.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategories(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(categoryService.getCategoriesForUser(currentUser.getId()));
    }
}
