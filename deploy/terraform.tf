provider "aws" {
  region  = "us-east-1"
  secret_key = ""
}

# Create a VPC
resource "aws_vpc" "example" {
  cidr_block = "10.0.0.0/16"
}
