# dyn-aws-dns

A simple way to use AWS Route53 as a Dynamic DNS service.

This NodeJS script assumes that you already have your domain setup with Route53 including a `A Record` which points to your home ip.

You can add it to your home server with a cron job to make sure your `A Record` will always point to your home ip.
