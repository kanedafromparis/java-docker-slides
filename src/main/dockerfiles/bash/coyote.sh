#!/bin/sh
#
# This script is used in order to 
#
#

JVM_OPTIONS=" ";

case $COYOTE_STAGE in
 	0) JVM_OPTIONS=" " ;;
 	1) JVM_OPTIONS=" -Xms256M -Xmx512M " ;;
 	2) JVM_OPTIONS=" -Xms512M -Xmx2048M " ;;
  
	3) JVM_OPTIONS=" -XshowSettings:vm -XX:+PrintGCDetails " ;;
  4) JVM_OPTIONS=" -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm -XX:+PrintGCDetails" ;;
	5) JVM_OPTIONS=" -Xms256M -Xmx512M -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm -XX:+PrintGCDetails" ;;
	6) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XshowSettings:vm -XX:+PrintGCDetails" ;;
	  
	7) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -Xms256M -Xmx512M -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm -XX:+PrintGCDetails" ;;
	8) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm -XX:+PrintGCDetails" ;;
	9) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=0.8 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm -XX:+PrintGCDetails" ;;
  10) JVM_OPTIONS=" -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=2 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dump -XshowSettings:vm -XX:+PrintGCDetails" ;;
	*) echo "INVALID NUMBER!" ;;
esac

cd /opt/kaboom;

echo "cmd : java $JVM_OPTIONS KaboomServer $PORT_NUMBER";

java $JVM_OPTIONS KaboomServer $PORT_NUMBER