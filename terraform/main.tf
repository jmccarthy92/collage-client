resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.appname}-client-${var.environment}"
  location = var.location

  tags = {
    environment = var.environment
  }
}

resource "azurerm_app_service_plan" "sp" {
  name                = "sp-${var.appname}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "linux"
  reserved            = true

  sku {
    tier = "Free"
    size = "F1"
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_application_insights" "reactapp_application_insights" {
  name                = "appinsights-${var.appname}-client-${var.environment}"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
}

resource "azurerm_app_service" "reactapp" {
  name                = "client-${var.appname}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.sp.id

  site_config {
    # Run "az webapp list-runtimes" for current supported values, but always
    # output the value of process.version from a running app because you might
    # not get the version you expect
    linux_fx_version          = "node|16"
    # always_on                 = true
  }

  app_settings = {
    "SERVERLESS_URL"               = "https://${data.terraform_remote_state.functionapp_services.outputs.azure_function_app_name}.azurewebsites.net",
    "CONTAINER_NAME"               = var.appname,
    "BLOB_STORAGE_URL"             = "https://${data.terraform_remote_state.functionapp_services.outputs.azure_storage_account_name}.blob.core.windows.net",
    "SIGNALR_CONNECTION_HUB"       = "https://${data.terraform_remote_state.functionapp_services.outputs.azure_function_app_name}.azurewebsites.net",
    # "WEBSITE_RUN_FROM_PACKAGE"     = "1",
    "WEBSITE_NODE_DEFAULT_VERSION" = "16.9.1"
  }

  tags = {
    environment = var.environment
  }

}
