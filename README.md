# Cloud-Native DevSecOps Pipeline

An end-to-end DevSecOps project that takes a static web application (**CloudNova**) from source code to a monitored, security-scanned deployment. Infrastructure is provisioned with **Terraform** on **AWS**, the app is containerized with **Docker**, built and deployed through a **Jenkins** pipeline with **Trivy** vulnerability scanning, run on **Kubernetes (Minikube)**, and monitored with **Prometheus** and **Grafana**.

## Pipeline Overview

```
GitHub  -->  Jenkins  -->  Docker Build  -->  Trivy Scan  -->  Deploy  -->  Kubernetes  -->  Prometheus / Grafana
(source)    (CI/CD)       (image)           (HIGH/CRITICAL    (container)   (Minikube)       (monitoring & alerts)
                                             gate)
```

Jenkins pipeline stages (from the `Jenkinsfile`):

1. **Checkout**: pull the code from GitHub
2. **Build Docker Image**: `docker build -t cloudnova-website:${BUILD_NUMBER} .`
3. **Trivy Security Scan**: fail the build on `HIGH` / `CRITICAL` vulnerabilities
4. **Deploy Application**: run the container on port 80

## Tech Stack

| Area | Tool |
|---|---|
| Infrastructure as Code | Terraform |
| Cloud | AWS EC2 (Ubuntu 24.04, `us-east-1`) |
| Containerization | Docker, Nginx |
| CI/CD | Jenkins |
| Security scanning | Trivy |
| Orchestration | Kubernetes (Minikube, kubectl) |
| Package manager | Helm |
| Monitoring and alerting | Prometheus, Grafana |
| Source control | Git, GitHub |

## Repository Structure

```
.
├── css/
├── js/
├── Dockerfile
├── Jenkinsfile
├── index.html
├── about.html
├── services.html
├── contact.html
└── README.md
```

## Ports Used

| Service | Port |
|---|---|
| Web application | 80 |
| Jenkins | 8080 |
| Application (Kubernetes port-forward) | 8081 |
| Prometheus | 9090 |
| Grafana | 3000 |

## Step-by-Step Implementation


### 1. Infrastructure Provisioning (Terraform + AWS)

#### Step 1: Check prerequisites

Verify that Git, Docker, VS Code, WSL and Terraform are installed on the local machine.

![Step 1: Check prerequisites](images/step-image01.png)

#### Step 2: Create the EC2 instance with Terraform

An Ubuntu 24.04 EC2 instance is provisioned in `us-east-1` using Terraform, along with a security group with the required inbound rules (SSH restricted to my IP, plus the application and tool ports).

![Step 2: Create the EC2 instance with Terraform](images/step-image02.png)

![Step 2: Create the EC2 instance with Terraform](images/step-image03.png)

#### Step 3: Connect to the instance via SSH

![Step 3: Connect to the instance via SSH](images/step-image04.png)

### 2. Containerizing the Application (Docker)

#### Step 4: Install Git, Docker and related packages

![Step 4: Install Git, Docker and related packages](images/step-image05.png)

#### Step 5: Clone the application repository

Clone the web application repository that was pushed to GitHub.

![Step 5: Clone the application repository](images/step-image06.png)

#### Step 6: Application structure

A static website (`index.html`, `about.html`, `services.html`, `contact.html`, plus `css/` and `js/`).

![Step 6: Application structure](images/step-image07.png)

#### Step 7: Create the Dockerfile

Create a `Dockerfile` (`nano Dockerfile`) that serves the site with Nginx.

![Step 7: Create the Dockerfile](images/step-image08.png)

#### Step 8: Build the Docker image

![Step 8: Build the Docker image](images/step-image09.png)

#### Step 9: Run the container and test locally

`HTTP/1.1 200 OK` and `Server: nginx` confirm the container is serving the site correctly.

![Step 9: Run the container and test locally](images/step-image10.png)

#### Step 10: Access the app in the browser

Open `http://<EC2_PUBLIC_IP>` to see the running project.

![Step 10: Access the app in the browser](images/step-image11.png)

### 3. CI/CD with Jenkins

#### Step 11: Install Java

![Step 11: Install Java](images/step-image12.png)

#### Step 12: Add the Jenkins repository key and LTS repository

![Step 12: Add the Jenkins repository key and LTS repository](images/step-image13.png)

#### Step 13: Install Jenkins

![Step 13: Install Jenkins](images/step-image14.png)

#### Step 14: Start Jenkins and check its status

![Step 14: Start Jenkins and check its status](images/step-image15.png)

#### Step 15: Access Jenkins from Windows using SSH tunnelling

![Step 15: Access Jenkins from Windows using SSH tunnelling](images/step-image16.png)

#### Step 16: Open `localhost:8080`

The *Unlock Jenkins* page opens through the tunnel.

![Step 16: Open `localhost:8080`](images/step-image17.png)

#### Step 17: Install suggested plugins

![Step 17: Install suggested plugins](images/step-image18.png)

![Step 17: Install suggested plugins](images/step-image19.png)

#### Step 18: Create the admin user

![Step 18: Create the admin user](images/step-image20.png)

#### Step 19: Add Jenkins to the `docker` group

![Step 19: Add Jenkins to the `docker` group](images/step-image21.png)

#### Step 20: Verify Docker access from Jenkins

![Step 20: Verify Docker access from Jenkins](images/step-image22.png)

#### Step 21: Progress checkpoint

At this point three things are complete: infrastructure provisioned, application containerized, and Jenkins installed.

![Step 21: Progress checkpoint](images/step-image23.png)

#### Step 22: Add the Jenkinsfile and Dockerfile to the GitHub repository

![Step 22: Add the Jenkinsfile and Dockerfile to the GitHub repository](images/step-image24.png)

#### Step 23: Create a new pipeline job

Click **New Item** and create a Pipeline job.

![Step 23: Create a new pipeline job](images/step-image25.png)

#### Step 24: Configure the repository and branch, then build

Enter the repository URL, set the branch to `main`, save, and click **Build Now**.

![Step 24: Configure the repository and branch, then build](images/step-image26.png)

#### Step 25: Pipeline runs successfully

All stages complete successfully.

![Step 25: Pipeline runs successfully](images/step-image27.png)

![Step 25: Pipeline runs successfully](images/step-image28.png)

#### Step 26: Confirm the container is running

![Step 26: Confirm the container is running](images/step-image29.png)

![Step 26: Confirm the container is running](images/step-image30.png)

### 4. Security Scanning (Trivy)

#### Step 27: Install Trivy

![Step 27: Install Trivy](images/step-image31.png)

![Step 27: Install Trivy](images/step-image32.png)

#### Step 28: Add the Trivy scan stage to the Jenkinsfile

The scan checks the built image for `HIGH` and `CRITICAL` vulnerabilities and fails the build (`--exit-code 1`) if any are found.

![Step 28: Add the Trivy scan stage to the Jenkinsfile](images/step-image33.png)

#### Step 29: Trivy scan during the Jenkins build

Trivy runs automatically on every build.

![Step 29: Trivy scan during the Jenkins build](images/step-image34.png)

![Step 29: Trivy scan during the Jenkins build](images/step-image35.png)

### 5. Kubernetes Deployment (Minikube)

#### Step 30: Download kubectl

![Step 30: Download kubectl](images/step-image36.png)

#### Step 31: Verify kubectl

![Step 31: Verify kubectl](images/step-image37.png)

#### Step 32: Install Minikube and check its status

![Step 32: Install Minikube and check its status](images/step-image38.png)

#### Step 33: Create the Kubernetes deployment file

![Step 33: Create the Kubernetes deployment file](images/step-image39.png)

#### Step 34: Check the deployment and pods

![Step 34: Check the deployment and pods](images/step-image40.png)

![Step 34: Check the deployment and pods](images/step-image41.png)

#### Step 35: Port-forward to 8081

Forward the service to port 8081 and connect through SSH from a new PowerShell window.

![Step 35: Port-forward to 8081](images/step-image42.png)

#### Step 36: Self-healing demonstrated

Kubernetes automatically created a third replica and assigned it an IP.

![Step 36: Self-healing demonstrated](images/step-image43.png)

### 6. Monitoring and Alerting (Prometheus + Grafana)

#### Step 37: Install Helm

![Step 37: Install Helm](images/step-image44.png)

#### Step 38: Install Prometheus

Install Prometheus with Helm and create `prometheus-custom-values.yaml`.

![Step 38: Install Prometheus](images/step-image45.png)

#### Step 39: Access Prometheus on port 9090

Port-forward Prometheus to 9090 and connect through SSH in a new PowerShell window.

![Step 39: Access Prometheus on port 9090](images/step-image46.png)

![Step 39: Access Prometheus on port 9090](images/step-image47.png)

#### Step 40: Install and configure Grafana

![Step 40: Install and configure Grafana](images/step-image48.png)

#### Step 41: Access Grafana on port 3000

Port-forward Grafana to 3000, connect through SSH, and log in as `admin` with the generated password.

![Step 41: Access Grafana on port 3000](images/step-image49.png)

#### Step 42: Add Prometheus as a data source

Go to **Connections → Data sources → Prometheus**, enter the connection URL, then **Save & test**.

![Step 42: Add Prometheus as a data source](images/step-image50.png)

#### Step 43: Import a dashboard

![Step 43: Import a dashboard](images/step-image51.png)

![Step 43: Import a dashboard](images/step-image52.png)

#### Step 44: Add the Prometheus metrics plugin to Jenkins

Go to **Manage Jenkins → Available plugins → Prometheus metrics**.

![Step 44: Add the Prometheus metrics plugin to Jenkins](images/step-image53.png)

#### Step 45: Add more metrics

![Step 45: Add more metrics](images/step-image54.png)

#### Step 46: Set up alerting

![Step 46: Set up alerting](images/step-image55.png)

## Key Takeaways

- Infrastructure is reproducible because it is defined as code with Terraform.
- Security is built into the pipeline: Trivy scans every image and fails the build on serious vulnerabilities before anything is deployed.
- Kubernetes provides self-healing, as shown by the automatic replica recreation.
- Prometheus and Grafana give visibility into the cluster and Jenkins, with alerting configured.

## Notes

- Replace `<EC2_PUBLIC_IP>` with the public IP of your own EC2 instance. Never commit private keys (`.pem`), passwords or tokens to the repository.
- Remember to destroy the AWS resources when finished (`terraform destroy`) to avoid unexpected charges.

## Author

**Somnath Singh**: [GitHub](https://github.com/somnathsingh712)
