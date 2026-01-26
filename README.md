# Production-Grade Kubernetes Platform on AWS

This repository contains all the configuration and source code for a comprehensive, production-grade Kubernetes platform built on AWS. The entire platform is designed to be managed through Infrastructure as Code (IaC) and a GitOps workflow.

## Project Overview & Architecture

The goal of this project is to showcase a modern, scalable, and resilient way to manage cloud infrastructure and deploy applications. It uses a suite of industry-standard DevOps tools to automate the entire lifecycle.

<br>



<br>

The architecture consists of:
- **Cloud Provider**: AWS
- **Container Orchestration**: Amazon EKS (Elastic Kubernetes Service)
- **Infrastructure as Code (IaC)**: Terraform for provisioning the VPC and EKS cluster.
- **GitOps Controller**: Argo CD, which syncs the cluster's state from the manifests in this Git repo.
- **Application Source**: A simple Node.js application, containerized with Docker.
- **Observability**: A full "PLG" stack with **P**rometheus (metrics), **L**oki (logs), and **G**rafana (dashboards).

---

## Core Components

### 1. Application Code (`/app-source-code`)
A simple Node.js microservice that serves as the example application to be deployed.
- **`app.js`**: A basic "Hello, World" web server that returns a JSON response.
- **`Dockerfile`**: A multi-stage Dockerfile to create a lightweight, production-ready container image of the application.

### 2. Infrastructure as Code (`/terraform`)
This directory contains the Terraform code to provision the entire AWS infrastructure.
- **`main.tf`**: Defines the AWS VPC (Virtual Private Cloud), subnets, and the Amazon EKS cluster itself using the official AWS Terraform modules.
- **`variables.tf`**: Centralizes customizable values like the AWS region and cluster name.
- **`outputs.tf`**: Exposes important information after deployment, such as the command to configure `kubectl`.

### 3. GitOps Manifests (`/gitops-manifests`)
This is the heart of the GitOps workflow and acts as the "single source of truth" for the Kubernetes cluster. Argo CD is configured to monitor this directory.
- **`root-app.yaml`**: The main Argo CD application that bootstraps the entire system by deploying all other applications.
- **`apps/templates/`**: Contains the Argo CD `Application` definitions for our `sample-app` and the `monitoring` stack.
- **`charts/sample-app`**: A Helm chart for deploying our sample Node.js application. The `deployment.yaml` and `service.yaml` define how the application runs in the cluster.

---

## How It Works

1.  **Infrastructure Provisioning**: A developer runs `terraform apply` in the `/terraform` directory to create the EKS cluster. This is typically a one-time setup step.
2.  **Argo CD Installation**: Argo CD is manually installed onto the cluster. The `root-app.yaml` manifest is then applied, pointing Argo CD to this repository.
3.  **Application Deployment (GitOps)**:
    - When a developer commits and pushes a change to the `/gitops-manifests/charts/sample-app` directory (e.g., updating the image version in `deployment.yaml`), Argo CD detects the change in Git.
    - Argo CD automatically compares the new state in Git with the running state in the cluster and applies the changes, deploying the new version of the application. **There is no manual `kubectl apply` needed for applications.**
4.  **Observability Deployment**: In the same way, the Prometheus and Grafana stack is deployed and configured just by having its Argo CD application manifest present in the Git repository.

## To Run This Project
To replicate this setup in a real environment, you would need:
- An AWS Account
- A GitHub Account
- A Docker Hub Account
- Locally installed tools: `Terraform`, `kubectl`, `aws-cli`

The full setup process would involve:
1.  Cloning this repository locally.
2.  Configuring AWS credentials.
3.  Running `terraform apply` to build the infrastructure.
4.  Installing Argo CD and applying the `root-app.yaml` manifest to point to your repository.
5.  Building and pushing the Docker image from `/app-source-code`.
6.  Committing any changes to trigger the GitOps workflow.

---

This project serves as a powerful demonstration of how to build and manage a cloud-native platform using modern DevOps principles.
