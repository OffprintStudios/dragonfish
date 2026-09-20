mod check_email;
mod create_profile;
mod forgot_password;
mod log_in;
mod sign_up;
mod switch_profile;

use icondata as TablerIcon;
use leptos::prelude::*;
use leptos_icons::*;
use leptos_router::components::{Outlet, ParentRoute, Route, A};
use leptos_router::{path, MatchNestedRoutes};

use check_email::CheckEmailPage;
use forgot_password::ForgotPasswordPage;
use log_in::LogInPage;
use sign_up::SignUpPage;

#[component(transparent)]
pub fn AuthRoutes() -> impl MatchNestedRoutes + Clone {
    view! {
        <ParentRoute path=path!("/") view=AuthLayout>
            <Route path=path!("log-in") view=LogInPage />
            <Route path=path!("sign-up") view=SignUpPage />
            <Route path=path!("check-email") view=CheckEmailPage />
            <Route path=path!("forgot-password") view=ForgotPasswordPage />
            // <Route path=path!("switch-profile") view=SwitchProfilePage ssr=SsrMode::Async />
            // <Route path=path!("create-profile") view=CreateProfilePage ssr=SsrMode::Async />
        </ParentRoute>
    }
    .into_inner()
}

#[component]
fn AuthLayout() -> impl IntoView {
    view! {
        <div
            class="flex flex-col items-center justify-center w-full h-svh bg-cover bg-center relative z-0"
            style="background-image: url('/images/mountains.jpg')"
        >
            <div class="absolute top-4 left-4 z-50">
                <A href="/">
                    <span><Icon icon=TablerIcon::TbSquareRoundedXOutline width="32px" height="32px" style="color: rgb(228 228 231 / 0.75);" /></span>
                </A>
            </div>
            <Outlet />
        </div>
    }
}
