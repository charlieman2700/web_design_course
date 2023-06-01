use rocket_dyn_templates::handlebars::handlebars_helper;

handlebars_helper!(firstCharUpper: |v: str| v.chars().next().unwrap().to_uppercase().to_string());
