# NGINX Log Rotation Configuration & Management

This document details the technical implementation of log rotation for the NGINX web server using the `logrotate` utility. This configuration ensures efficient disk space management and maintains historical records of server activity, complying with the project's auditing and maintenance requirements.

---

## NGINX Logging Architecture

**NGINX** is a high-performance web server and reverse proxy. For monitoring and debugging purposes, it automatically generates two primary types of log files:

*   **`access.log`**: Records every client request processed by the server. It includes details such as the client's IP address, the requested URL, the HTTP status code returned, and the User-Agent.
*   **`error.log`**: Records any issues encountered by the server. This includes configuration errors, upstream connection failures, and critical application issues.

By default, these files are located in `/var/log/nginx/`. Without proper management, these files can grow indefinitely, potentially consuming all available disk space and making analysis difficult.

---

## Introduction to Logrotate

**Logrotate** is a system utility designed to simplify the administration of log files on systems that generate a lot of log output. It allows for the automatic rotation, compression, removal, and mailing of log files.

**Key Benefits:**
*   **Disk Space Management:** Prevents logs from growing too large.
*   **Organization:** Archives logs by date or size for easier auditing.
*   **Performance:** Keeps active log files small, improving write performance.

---

## Configuration Implementation

The rotation of NGINX logs is controlled by the configuration file located at `/etc/logrotate.d/nginx`. Below is the standard configuration used and an explanation of each directive.

### Configuration File Content

```nginx
/var/log/nginx/*.log {
    daily
    dateext
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi \
    endscript
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
```

### Directive Explanation

*   **`daily`**: Logs are rotated once every day.
*   **`dateext`**: Adds a date extension (YYYYMMDD) to the rotated log file instead of a simple number.
*   **`rotate 14`**: Keeps 14 days worth of backlogs. The 15th oldest log will be deleted.
*   **`compress`**: Old versions of log files are compressed with gzip to save space.
*   **`delaycompress`**: Postpones compression of the previous log file to the next rotation cycle. This is useful if the program (NGINX) might still be writing to the old file immediately after rotation.
*   **`notifempty`**: Do not rotate the log if it is empty.
*   **`create 0640 www-data adm`**: Immediately after rotation (renaming the old log), a new empty log file is created with specific permissions (`0640`) and ownership (user `www-data`, group `adm`).
*   **`sharedscripts`**: The `prerotate` and `postrotate` scripts are run only once, no matter how many logs match the wildcard pattern (`*.log`), instead of running for each file.
*   **`postrotate`**: A script executed *after* the log file is rotated.
    *   `systemctl reload nginx`: Reloads the NGINX configuration and re-opens log files without dropping connections. This ensures NGINX writes to the new file.

---

## Manual Testing & Verification

To verify the configuration without waiting for the daily cron job, a manual rotation can be forced.

**Command:**
```bash
sudo logrotate -f /etc/logrotate.d/nginx
```

*   **`-f` (force):** Tells logrotate to perform the rotation even if the criteria (like `daily`) haven't been met yet.

**Verification Steps:**
1.  Run `ls -l /var/log/nginx` before the command.
2.  Execute the force command.
3.  Run `ls -l /var/log/nginx` again.
4.  **Expected Result:** You should see a new set of rotated files (e.g., `access.log.1` or with a new date stamp) and the main `access.log` should be reset to size 0.

---

## Analysis of Log Status

The following output from `ls -l /var/log/nginx` demonstrates a successful rotation event (after performing the manual test or waiting for the daily job):

![Log Rotation Output](./images/logs-rotations.png)

### Interpretation

1.  **Active Files (`access.log`, `error.log`):**
    *   **Size:** `0` bytes.
    *   **Timestamp:** `Nov 27 15:54`.
    *   **Meaning:** These are the *new* files created immediately after rotation. The size is 0 because no new requests or errors have occurred since the rotation at 15:54. NGINX is now pointing to these files.

2.  **Rotated Files (`access.log-20251127`, `error.log-20251127`):**
    *   **Size:** `1707293` bytes (approx 1.7MB) for access log.
    *   **Timestamp:** `Nov 27 15:46` (Last write before rotation).
    *   **Meaning:** These are the *historical* logs containing data up until the moment of rotation. The suffix `-20251127` indicates the date they were rotated.

3.  **Permissions:**
    *   `-rw-r-----`: Read/Write for owner, Read for group.
    *   **Owner:** `www-data` (The user NGINX runs as).
    *   **Group:** `adm` (System administration group, allowing admins to read logs).