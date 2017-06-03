
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.text.NumberFormat;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.WeakHashMap;

public class KaboomServer {

    public static void main(String[] args) throws Exception {
        int port = 9090;
        if (0 < args.length) {
            port = Integer.parseInt(args[0]);
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new KRootHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Kabooum app listening on port " + port);
    }

    static class KRootHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange t) throws IOException {
            String path = t.getRequestURI().getPath().trim();
            if (path.equals("/")
                    || path.contains("..")) {
                getDefaultPage(t);
                return;
            }

            if (path.equals("/kaboom")) {
                getKaboomPage(t);
                return;
            }
            System.out.println("[access] " + path);

        }

        private void getDefaultPage(HttpExchange t) throws IOException {
            OutputStream os = t.getResponseBody();
            Runtime runtime = Runtime.getRuntime();
            NumberFormat format = NumberFormat.getInstance();
            StringBuilder sb = new StringBuilder();
            long maxMemory = runtime.maxMemory();
            long allocatedMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            
            sb.append("<html><title>Kaboom server</title><body>");
            sb.append("<div><h3>Kaboom server</h3>This server is intended to crash all the memory of the host if you go to <a href=\"/kaboom\">this links<a><div>");
            sb.append("<div>").append("free memory: ").append(format.format(freeMemory / 1024)).append("<br/>");
            sb.append("allocated memory: ").append(format.format(allocatedMemory / 1024)).append("<br/>");
            sb.append("max memory: ").append(format.format(maxMemory / 1024)).append("<br/>");
            sb.append("total free memory: ").append(format.format((freeMemory + (maxMemory - allocatedMemory)) / 1024)).append("<br/>");
            sb.append("</div></body></html>");
            System.out.println("[debug] " + sb.toString());
            t.sendResponseHeaders(200, sb.length());
            os.write(sb.toString().getBytes());
            os.close();
        }

        /**
         * 
         * @param t
         * @throws IOException 
         * @see http://alvinalexander.com/blog/post/java/java-program-consume-all-memory-ram-on-computer
         */
        private void getKaboomPage(HttpExchange t) throws IOException {
            OutputStream os = t.getResponseBody();
            Runtime runtime = Runtime.getRuntime();
            NumberFormat format = NumberFormat.getInstance();
            StringBuilder sb = new StringBuilder();

            sb.append("<html><title>Kaboom In Progress</title><body><div>AH AH AH </div><div>log at logs...</div></body></html>");
            System.out.println("[debug] " + sb.toString());
            t.sendResponseHeaders(200, sb.length());
            os.write(sb.toString().getBytes());
            os.close();

            Map v;
            v = new WeakHashMap();
            int i = 0;
            while (true) {
                i++;
                if (i>10000){
                  i=0;
                  // the Thread.sleep is here in order to allows
                  // to see the docker host swapping
                  try {
                      Thread.sleep(1000);                 //1000 milliseconds is one second.
                  } catch(InterruptedException ex) {
                      Thread.currentThread().interrupt();
                  }
                }
                byte b[] = new byte[1048576];
                Object put = v.put(i, b);
                //System.out.println("free memory: " + format.format(runtime.freeMemory()/ 1024));
            }

        }
    }


}
