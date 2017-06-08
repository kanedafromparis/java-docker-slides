#!/usr/bin/jjs -fv
#
#
# reminder : docker run --rm -t -i dockerfile.jdk8.alpine.36.131 /bin/sh
#
# export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
# @todo
# export JAVA_HOME=$(/usr/libexec/java_home -v 1.9)
#
# docker-machine create --driver virtualbox  --virtualbox-cpu-count "4" --virtualbox-memory "4089" --virtualbox-boot2docker-url boot2docker-v1.12.5.iso demo-jvm
# docker export 07f1f3f02e14 | tar tvf - | grep -C 2 var/dump/
# DOCKERIMGID=`docker ps -alq` && docker cp $DOCKERIMGID:/var/dump .
# DOCKERIMGID=`docker ps -alq` && docker inspect $DOCKERIMGID | jq .[0].State
# http://tldp.org/LDP/abs/html/exitcodes.html
# 
# curl http://$(docker-machine ip demo-jvm):9093/kaboom
# export TERM=linux && top
#
# 

var dockerfileFolder = "./src/main/dockerfiles";

var i=0;
var arg0 = arguments[i++];
var action = arguments[i++];
var arg2 = arguments[i++];
var image = arguments[i++];
var arg4 = arguments[i++];
var stage = arguments[i++];
var arg6 = arguments[i++];
var test = arguments[i++];

function printHelp(){
  print("This script is use to build various docker image");
  print("It should run form the root maven project");
  print("usage :");
  print("jjs <files> [<arguments>]");
  print("    --action [build, run]");
  print("    desription....");
  print("    --image [1,2,....]");
  print("    desription....");
  print("    --docker-param [1,2,....]");
  print("    desription....");
  print("    --java-param [1,2,....]");
  print("    desription....");
}


function build(dockerfile, dockerfileFolder){
  var dockertag = dockerfile.toLowerCase();
  var cmd = "docker build -t "+dockertag+" -f "+dockerfileFolder+"/"+dockerfile+" ./ ";
  print("cmd:\n " + cmd);
  var System = Java.type("java.lang.System");
  $EXEC(cmd, System.in, System.out, System.err);
}

function run(param, dockerfile, test){
  var dockertag = dockerfile.toLowerCase();;
  // remember that you do not use --rm
  //var cmd = "docker run -it "+param+" -p 9090:9090 -p 2020:2020 -e \"JAVA_PARAMS="+test+"\" "+dockertag+" ";
  var cmd = "docker run -it "+param+" -p 9090:9090 -e \"JAVA_PARAMS="+test+"\" "+dockertag+" ";

  print("cmd:\n " + cmd);
  
  print("  for i in {1..100} ; do curl http://$(docker-machine ip demo-jvm):9090/kaboom ; date ; done");
  
  var System = Java.type("java.lang.System");
  
  $EXEC(cmd, System.in, System.out, System.err);
  
  print("DOCKERIMGID=`docker ps -alq` && docker inspect $DOCKERIMGID | jq .[0].State");
  
}

function getImage(image) {
  switch(image) {
    case "0":
        return "Dockerfile.jdk8.alpine.34.111";
        
    case "1":
        return "Dockerfile.jdk8.alpine.36.131";
        
    case "2":
        return "Dockerfile.jdk8.centos.111";
        
    case "3":
        return "Dockerfile.jdk8.centos.131";
        
    case "4":
        print("only for builds");
        return "Dockerfile.node6.9.5";        

      default:
        print("no such image value using default");
        return "Dockerfile.jdk8.sample01";
  }
}

function getDockerParam(image){
  
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
        print("The host will consume all it's swap");
        return "-m 512M --memory-swap -1";    
        
    case "4":
        print("The host should not be able to use more then 10 M of swap");
        return "-m 512M --memory-swap 522M";

    

    case "99":
        print("@Todo display the variante ");
        return "-m 512M --memory-reservation 256M --memory-swap -1";

        
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
  arg4 === "--docker-param" && 
  arg6 === "--java-param"){
  
  if (isNumber(test)){
    run(getDockerParam(stage), getImage(image), test)
  }else{
    printHelp();
  }

}else{
    printHelp();
}
//print(`ls -l`)
// print("--- arg0    --- "+arg0);
// print("--- action  --- "+action);
// print("--- arg2    --- "+arg2);
// print("--- image   --- "+image);
// print("--- arg4    --- "+arg4);
// print("--- stage  --- "+action);
// print("--- arg6    --- "+arg6);
// print("--- test   --- "+test);
