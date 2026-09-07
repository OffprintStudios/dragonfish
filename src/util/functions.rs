use crate::database::models::accounts::Role;
use std::fmt::Display;

/// Determines the most prominent role in an array of roles
pub fn get_prominent_role(roles: Vec<Role>) -> Role {
    roles.iter().min().copied().unwrap_or(Role::User)
}

/// Abbreviates a number for better readability.
pub fn abbreviate<T>(number: T) -> String
where
    T: Copy + Display + PartialOrd,
    T: std::ops::Div<Output = T>,
    T: std::ops::Rem<Output = T>,
    T: From<i32>,
{
    let hundred = T::from(100);
    let thousand = T::from(1000);
    let ten_thousand = T::from(10_000);

    if number < thousand {
        return number.to_string();
    }

    if number < ten_thousand {
        let whole_part = number / thousand;
        let decimal_part = (number % thousand) / hundred;

        if decimal_part == T::from(0) {
            return format!("{whole_part}k");
        } else {
            return format!("{whole_part}.{decimal_part}k");
        }
    }

    let thousands = number / thousand;
    format!("{thousands}k")
}

/// Determines whether or not to add an `s` at the end of a word to pluralize it
pub fn pluralize<T>(number: T) -> String
where
    T: Copy + Display + PartialOrd,
    T: std::ops::Div<Output = T>,
    T: std::ops::Rem<Output = T>,
    T: From<i32>,
{
    match number == T::from(1) {
        true => "".into(),
        false => "s".into(),
    }
}

// Finds the intersection of two vectors
pub fn intersection<T: PartialEq + Clone + Eq + std::hash::Hash>(vec1: &[T], vec2: &[T]) -> Vec<T> {
    use std::collections::HashSet;

    let a: HashSet<T> = vec1.iter().cloned().collect();
    let b: HashSet<T> = vec2.iter().cloned().collect();

    a.intersection(&b).cloned().collect()
}
