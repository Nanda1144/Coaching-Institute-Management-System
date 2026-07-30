#!/bin/bash
# Monthly Attendance Report Cron Setup
# Run this script to set up a cron job that generates monthly attendance reports.
#
# The backend endpoint GET /api/reports/attendance/monthly already exists and
# returns per-student and per-day breakdowns for the current month.
#
# Options:
#   A. cron-job.org (free, no server needed)
#      URL: https://your-domain.com/api/reports/attendance/monthly
#      Schedule: Every month on the 1st at 00:00
#
#   B. Linux/Mac cron (if running your own server)
#      Add this line to crontab -e:
#      0 0 1 * * curl -s https://your-domain.com/api/reports/attendance/monthly > /dev/null
#
#   C. GitHub Actions (free, if repo is on GitHub)
#      Create .github/workflows/monthly-report.yml:
#
# name: Monthly Attendance Report
# on:
#   schedule:
#     - cron: '0 0 1 * *'
# jobs:
#   generate:
#     runs-on: ubuntu-latest
#     steps:
#       - name: Generate report
#         run: curl -s https://your-domain.com/api/reports/attendance/monthly
echo "See instructions above for cron setup."
echo "The endpoint GET /api/reports/attendance/monthly is ready."
