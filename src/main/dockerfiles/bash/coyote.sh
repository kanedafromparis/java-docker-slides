#!/bin/sh
#
# This script is used in order to 
#
#

JVM_OPTIONS=" ";

case $JAVA_PARAM in
 	0) JVM_OPTIONS=" " ;;
 	1) JVM_OPTIONS=" -Xms256M -Xmx512M " ;;
 	2) JVM_OPTIONS=" -Xms512M -Xmx1024M " ;;# the jvm will get to 1024 via swap
  3) JVM_OPTIONS=" -Xms1024M -Xmx3584M " ;;

	4) JVM_OPTIONS=" -XshowSettings:vm " ;;
  
	5) JVM_OPTIONS=" -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm " ;;
	6) JVM_OPTIONS=" -Xms256M -Xmx512M -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm " ;;
	
	7) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XshowSettings:vm " ;;
	8) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -Xms256M -Xmx512M -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm " ;;
	9) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -XshowSettings:vm " ;;
	10) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=0.8 -XshowSettings:vm " ;;
  11) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=2 -XshowSettings:vm " ;;
	*) echo "INVALID NUMBER!" ;;
esac

cd /opt/kaboom;

echo "cmd : java $JVM_OPTIONS KaboomServer $PORT_NUMBER";

java $JVM_OPTIONS KaboomServer $PORT_NUMBER