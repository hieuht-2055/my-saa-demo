# Clarifications — Login Page (SAA 2025)

Screen: Login — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz

## Session 2026-07-24

- Q: How to handle Google OAuth provider credentials on local Supabase? → A: Scaffold [auth.external.google] in config.toml reading client id/secret from env + correct signInWithOAuth code + callback + docs; user supplies real Google creds later; no secrets committed
- Q: What scope for the VN/EN language selector / i18n? → A: Static VN only — selector renders (VN default, dropdown opens) but full translation infra deferred; login page ships in Vietnamese as designed
- Q: How to handle post-login /todo redirect and route protection when /todo does not exist? → A: Create a minimal protected /todo placeholder (shows logged-in user + logout) plus proxy.ts route protection so the full OAuth round-trip is verifiable
- Q: Post-login redirect destination? → A: /todo (per spec item 2.2.1)
- Q: Auth failure message text? → A: "Đăng nhập không thành công. Vui lòng thử lại." (spec item 2.2.1)
- Q: Which Google accounts may sign in? → A: All Google accounts allowed (spec item 2.2.1)
