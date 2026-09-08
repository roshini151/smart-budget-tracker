package com.smartbudget.service;

import com.smartbudget.dto.CategoryDTO;
import com.smartbudget.entity.Category;
import com.smartbudget.entity.User;
import com.smartbudget.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getCategoriesForUser(Long userId) {
        return categoryRepository.findAllAvailableForUser(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO mapToDTO(Category category) {
        if (category == null) return null;
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getType(),
                category.getIcon(),
                category.getColor()
        );
    }
}
