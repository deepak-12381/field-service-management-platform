 package com.keystone.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.MethodArgumentNotValidException;
import com.keystone.backend.exception.InvalidStatusTransitionException;
import com.keystone.backend.exception.BadRequestException;
import org.springframework.http.HttpStatus;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {

        Map<String, Object> error = new HashMap<>();

        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("error", HttpStatus.NOT_FOUND.getReasonPhrase());
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidStatusTransitionException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidStatusTransition(InvalidStatusTransitionException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, Object>> handleValidationException(
        MethodArgumentNotValidException ex) {

    Map<String, Object> error = new HashMap<>();

    error.put("timestamp", LocalDateTime.now());
    error.put("status", HttpStatus.BAD_REQUEST.value());
    error.put("error", "Validation Error");

    Map<String, String> validationErrors = new HashMap<>();

    ex.getBindingResult().getFieldErrors().forEach(fieldError ->
            validationErrors.put(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
            )
    );

    error.put("message", validationErrors);

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
}
    @ExceptionHandler(Exception.class)
public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {

    Map<String, Object> error = new HashMap<>();

    error.put("timestamp", LocalDateTime.now());
    error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
    error.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
    error.put("message", ex.getMessage());

    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
}

    
}