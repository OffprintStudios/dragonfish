use leptos::prelude::*;
use resend_rs::types::CreateEmailBaseOptions;
use resend_rs::Resend;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use thiserror::Error;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Email {
    pub kind: EmailKind,
    pub from: String,
    pub to: String,
    pub subject: String,
    pub token: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EmailKind {
    ConfirmEmail,
    PasswordReset,
}

#[derive(Debug, Error)]
#[allow(dead_code)]
pub enum EmailError {
    NoStorage,
    SomeError(&'static str),
}

impl std::fmt::Display for EmailError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{self:?}")
    }
}

pub async fn send_email(job: Email) -> Result<(), apalis::prelude::AbortError> {
    let resend = Resend::default();
    let base_url = std::env::var("SITE_BASE_URL").expect("SITE_BASE_URL not found!");

    let from = job.from;
    let to = [job.to];
    let subject = job.subject;
    let html_message = match job.kind {
        EmailKind::ConfirmEmail => {
            get_confirm_message(base_url, job.token.expect("Token cannot be empty"))
        }
        EmailKind::PasswordReset => {
            get_reset_message(base_url, job.token.expect("Token cannot be empty"))
        }
    };

    let email = CreateEmailBaseOptions::new(from, to, subject).with_html(&html_message);
    let _ = resend.emails.send(email).await.map_err(|_| {
        apalis::prelude::AbortError::new(Arc::new(Box::new(EmailError::SomeError(
            "Something went wrong!",
        ))))
    })?;

    Ok(())
}

fn get_confirm_message(base_url: String, token: String) -> String {
    view! {
        <div>
            <h1>"Welcome to Offprint!"</h1>
            <p>
                "On behalf of all of us on the dev team, we're so glad that you're here."
            </p>
            <p>
                "But first, we're gonna need to confirm your account. To get started, click the link below to verify your email address. Won't take more than a few seconds."
            </p>
            <a href=format!("{base_url}/check-email?token={token}")>"Verify Your Email Address"</a>
            <p>
                "Just a reminder: this code expires in one hour. If you need a new one, just attempt a login and we'll send you a new one."
            </p>
        </div>
    }.to_html()
}

fn get_reset_message(base_url: String, token: String) -> String {
    view! {
        <div>
            <h1>"Reset your Offprint password"</h1>
            <p>
                "Hey there! We've gotten word that you want to reset your Offprint password. If that's what you want, hit the link below to get started."
            </p>
            <a href=format!("{base_url}/forgot-password?token={token}")>"Reset Your Password"</a>
            <p>
                "If this wasn't requested by you, feel free to ignore this message. It'll expire after 1 hour."
            </p>
        </div>
    }.to_html()
}
