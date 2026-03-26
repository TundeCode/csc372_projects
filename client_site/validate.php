<?php
// validate.php
// Author: [Your Name]
// Date: March 2026
// Description: Reusable validation functions for AURUM site form inputs.

/**
 * Validates that a text string is within a given character length range.
 *
 * @param string $value  The text to validate.
 * @param int    $min    Minimum character length (inclusive).
 * @param int    $max    Maximum character length (inclusive).
 * @return bool  True if valid, false otherwise.
 */
function validateText(string $value, int $min, int $max): bool {
    $len = strlen(trim($value));
    return $len >= $min && $len <= $max;
}

/**
 * Validates that a value is numeric and falls within a specified range.
 *
 * @param mixed $value  The value to check.
 * @param float $min    Minimum allowed value (inclusive).
 * @param float $max    Maximum allowed value (inclusive).
 * @return bool  True if valid, false otherwise.
 */
function validateNumber(mixed $value, float $min, float $max): bool {
    if (!is_numeric($value)) return false;
    $num = (float) $value;
    return $num >= $min && $num <= $max;
}

/**
 * Validates that a selected option is within a predefined list of allowed values.
 *
 * @param string $value    The selected option to check.
 * @param array  $allowed  Array of valid option strings.
 * @return bool  True if the value exists in the allowed list, false otherwise.
 */
function validateOption(string $value, array $allowed): bool {
    return in_array($value, $allowed, true);
}