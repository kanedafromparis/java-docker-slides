#!/usr/bin/jjs -fv
#
#
# reminder : docker run --rm -t -i pj170613-01 /bin/sh
#
#
#
# docker-machine create --driver virtualbox  --virtualbox-cpu-count "4" --virtualbox-memory "4089" --virtualbox-boot2docker-url boot2docker-v1.9.0.iso demo-jvm
# docker export 07f1f3f02e14 | tar tvf - | grep -C 2 var/dump/
# DOCKERIMGID=`docker ps -alq` && docker cp $DOCKERIMGID:/var/dump .
# DOCKERIMGID=`docker ps -alq` && docker inspect $DOCKERIMGID | jq .[0].State
# http://tldp.org/LDP/abs/html/exitcodes.html
# 
# curl http://$(docker-machine ip demo-jvm):9093/kaboom-ah-ah-ah 
# export TERM=linux && top
#
# 

var dockerfileFolder = "../../../src/main/dockerfiles";


var arg0 = arguments[0];
var action = arguments[1];
var arg2 = arguments[2];
var image = arguments[3];
var arg4 = arguments[4];
var stage = arguments[5];
var arg6 = arguments[6];
var test = arguments[7];

function printHelp(){
  print("This script is use to build various docker image");
  print("usage :");
  print("jjs <files> [<arguments>]");
  print("    --action [build, run]");
  print("    desription....");
  print("    --image [1,2,....]");
  print("    desription....");
  print("    --stage [1,2,....]");
  print("    desription....");
  print("    --test [1,2,....]");
  print("    desription....");

  
}


function build(dockerfile, dockerfileFolder){
  var dockertag = dockerfile.toLowerCase();
  var cmd = "docker build -t "+dockertag+" -f "+dockerfileFolder+"/"+dockerfile+" ../../../";
  print("cmd: " + cmd);
  var System = Java.type("java.lang.System");
  $EXEC(cmd, System.in, System.out, System.err);
}

function run(param, dockerfile, test){
  var dockertag = dockerfile.toLowerCase();;
  // remember that you do not use --rm
  var cmd = "docker run -it "+param+" -p 9090:9090 -p 2020:2020 -e \"COYOTE_STAGE="+test+"\" "+dockertag+" ";
  print("cmd: " + cmd);
  var System = Java.type("java.lang.System");
  //@todo get ip from docker-machine
  print("curl http://192.168.99.43:9090/kaboom ");
  $EXEC(cmd, System.in, System.out, System.err);
}

function getImage(image) {
  switch(image) {
    case "0":
        return "Dockerfile.jdk8.alpine.34.111";
        
    case "1":
        return "Dockerfile.jdk8.alpine.36.131";
        
    case "2":
        //@todo centos version 111
        return "Dockerfile.jdk8.centos.111";
        
    case "3":
        //@todo centos version 131
        return "Dockerfile.jdk8.centos.131";
        
    case "4":
        return "Dockerfile.jdk8.alpine.34.111";        

      default:
        print("no such image value using default");
        return "Dockerfile.jdk8.sample01";
  }
}

function getStageParamImage(image){
  
  switch(stage) {
    case "0":
        print("@Todo display the variante ");
        return "";
        
    case "1":
        print("@Todo display the variante ");
        return "-m 256M";
        
    case "2":
        print("@Todo display the variante ");
        return "-m 512M";
        
    case "3":
        print("@Todo display the variante ");
        return "-m 256M --memory-swap 125m";

    case "4":
        print("@Todo display the variante ");
        return "-m 256M --memory-swap 256m";
        
    case "5":
        print("@Todo display the variante ");
        return "-m 256M --memory-swap -1";

    case "6":
        print("@Todo display the variante ");
        return "-m 512M --memory-reservation 200M --memory-swap -1";
        
        
    default:
        print("no such docker stage value using default");
        return "";
  }

}

function isNumber(obj) { 
  return !isNaN(parseFloat(obj)) 
}

if (arg0 == null || arg0 == "-h" || arg0 == "--help"){
  printHelp();
}else if (arg0 === "--action" && 
  arg2 === "--image" && 
  action === "build"){
  
  if (isNumber(image)){
    build(getImage(image), dockerfileFolder)
  }else{
    print("no such docker stage value using default");
    printHelp();
  }
}else if (arg0 === "--action" && 
  action === "run" &&
  arg2 === "--image" && 
  arg4 === "--stage" && 
  arg6 === "--test"){
  
  if (isNumber(test)){
    run(getStageParamImage(stage), getImage(image), test)
  }else{
    printHelp();
  }

}else{
    printHelp();
}

// print("--- arg0    --- "+arg0);
// print("--- action  --- "+action);
// print("--- arg2    --- "+arg2);
// print("--- image   --- "+image);
// print("--- arg4    --- "+arg4);
// print("--- stage  --- "+action);
// print("--- arg6    --- "+arg6);
// print("--- test   --- "+test);
