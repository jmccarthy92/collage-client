# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.65"
    }
  }

  backend "remote" {
    organization = "james-fun"
    workspaces {
      prefix = "gif-collage-client-"
    }
  }

  required_version = ">= 0.14.9"
}

provider "azurerm" {
  features {}
}

data "terraform_remote_state" "functionapp_services" {
  backend = "remote"

  config = {
    organization = "james-fun"
    workspaces = {
      name = "gif-collage-${var.environment}"
    }
  }
}
