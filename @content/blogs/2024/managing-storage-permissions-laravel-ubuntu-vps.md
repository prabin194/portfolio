---
title: "Managing Storage Permissions in Laravel on Ubuntu VPS: A Step-by-Step Guide"
date: "2024-01-31"
description: "Copy-paste commands to set Laravel storage permissions and ownership safely on Ubuntu." 
---

To change storage permissions in a Laravel application hosted on an Ubuntu VPS server, we typically need to adjust the permissions of the `storage` directory and its subdirectories.

Laravel requires write permissions for directories within the `storage` folder so the application can write logs, cache data, and perform other file-related operations.

## Steps to Change Storage Permissions

### 1. SSH into Your Server
Connect to your Ubuntu VPS server using SSH.

### 2. Navigate to Your Laravel Project Directory
Use the `cd` command to move into your Laravel project directory.  
This is commonly located under:

```bash
/var/www
````

(or another directory you chose during deployment)

### 3. Adjust Permissions

Use the `chmod` command to grant write permissions to the `storage` directory and its subdirectories.

```bash
sudo chmod -R 775 storage
```

This command sets:

* **Owner & Group:** read, write, execute
* **Others:** read and execute

Adjust permissions as needed based on your server setup and security requirements.

### 4. Adjust Ownership (Optional)

If your web server runs as a different user (for example, Apache uses `www-data`), you may need to update ownership.

```bash
sudo chown -R www-data:www-data storage
```

Replace `www-data:www-data` with the correct user and group for your environment.

### 5. Clear Cache and Config

After updating permissions, clear Laravel’s cache and configuration:

```bash
php artisan cache:clear
php artisan config:clear
```

### 6. Verify

Visit your Laravel application and confirm everything works correctly.
Check logs for errors and verify that file uploads, caching, and logging behave as expected.

By following these steps, you should be able to correctly configure storage permissions for your Laravel application running on an Ubuntu VPS. Always follow security best practices and grant only the permissions that are necessary.

