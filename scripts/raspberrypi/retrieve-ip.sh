#!/bin/sh

echo "retrieve-ip.sh started" > /tmp/ip_debug.log
ifconfig | tee -a /tmp/ip_debug.log

until [ $(netcat -z -w 5 google.com 443 && echo 1 || echo 0) -eq 1 ]; do
  echo "Waiting for internet connection..." | tee -a /tmp/ip_debug.log
  sleep 2
done

echo "Internet Connection up and running." | tee -a /tmp/ip_debug.log
echo "Waiting 30 seconds..." | tee -a /tmp/ip_debug.log
sleep 30

ifconfig | tee -a /tmp/ip_debug.log

echo "" > /tmp/ip.log
host myip.opendns.com resolver1.opendns.com >> /tmp/ip.log
ip -4 addr | grep -oP '(?<=inet\s)\d+(\.\d+){3}' >> /tmp/ip.log
uptime >> /tmp/ip.log

cat /tmp/ip.log | mailx -v \
        -s 'Raspberry PI has booted !' \
        -r "$HOSTNAME<no-reply@changeme.com>" \
        your-email@changeme.com your-second-email@changeme.com | \
        tee -a /tmp/ip_debug.log

currentIp=$(host myip.opendns.com resolver1.opendns.com | \
        grep "myip.opendns.com has address" | \
        cut -d' ' -f4) 
echo $currentIp > /tmp/last_public_ip.log

sleep 10