---
title: "Running PHP 7.4 and PHP 8.2 on the Same VPS: A Step-by-Step Guide"
date: "2024-11-16"
description: "Configure Apache on Ubuntu to serve different sites with PHP 7.4 and PHP 8.2 side by side."
readTime: "3 min"
tags: ["PHP", "Apache", "Ubuntu", "DevOps"]
---

When you host multiple PHP projects on one VPS, you often need different PHP versions. With Apache2 on Ubuntu, you can run PHP 7.4 for one site and PHP 8.2 for another using PHP-FPM. Here’s how.

## Step 1: Install both PHP versions

### 1.1 Add the PHP repository

```bash
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
```

### 1.2 Install PHP 7.4 and PHP 8.2 (FPM + CLI)

```bash
sudo apt install php7.4 php7.4-fpm php7.4-cli
sudo apt install php8.2 php8.2-fpm php8.2-cli
```

## Step 2: Configure Apache2 for multi-PHP

### 2.1 Enable required modules and configs

```bash
sudo a2enmod proxy_fcgi setenvif
sudo a2enconf php7.4-fpm
sudo a2enconf php8.2-fpm
sudo systemctl reload apache2
```

### 2.2 Create virtual hosts per PHP version

**PHP 7.4 vhost**

```apache
<VirtualHost *:80>
    ServerName example74.com
    DocumentRoot /var/www/html/project74

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php7.4-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/error74.log
    CustomLog ${APACHE_LOG_DIR}/access74.log combined
</VirtualHost>
```

**PHP 8.2 vhost**

```apache
<VirtualHost *:80>
    ServerName example82.com
    DocumentRoot /var/www/html/project82

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.2-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/error82.log
    CustomLog ${APACHE_LOG_DIR}/access82.log combined
</VirtualHost>
```

### 2.3 Enable the virtual hosts

```bash
sudo a2ensite example74.conf
sudo a2ensite example82.conf
sudo systemctl reload apache2
```

## Step 3: Test the setup

### 3.1 Add a `phpinfo()` script to each project

```php
<?php phpinfo(); ?>
```

### 3.2 Visit the URLs

- `http://example74.com` → should report **PHP 7.4**
- `http://example82.com` → should report **PHP 8.2**

## Step 4: Manage PHP CLI versions

### 4.1 Check current CLI PHP

```bash
php -v
```

### 4.2 Switch CLI version with update-alternatives

```bash
sudo update-alternatives --config php
```
Select the PHP version you need for CLI tasks.

## Final notes

1) **DNS/hosts** — Ensure `example74.com` and `example82.com` resolve to your VPS (DNS or `/etc/hosts`).  
2) **Permissions** — Adjust ownership/permissions for `/var/www/html/project74` and `/var/www/html/project82`.  
3) **Reloads** — Restart Apache after config changes: `sudo systemctl restart apache2`.

With this setup, legacy projects can stay on PHP 7.4 while new apps run on PHP 8.2, all on the same server.
