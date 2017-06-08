
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.text.NumberFormat;
import java.util.Map;
import java.util.Random;
import java.util.WeakHashMap;

public class KaboomServer {

    public static void main(String[] args) throws Exception {
        int port = 9090;
        if (0 < args.length) {
            port = Integer.parseInt(args[0]);
        }
// tag::start-server[]
        HttpServer server
                = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new KRootHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Kabooum app listening on port " + port);
// end::start-server[]
    }
    static final Map m = new WeakHashMap();
    static int nbUser = 0;

    static class KRootHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange t) throws IOException {
            String path = t.getRequestURI().getPath().trim();

            if (path.equals("/kaboom")) {
                getKaboomPage(t);
                return;
            }
            if (path.equals("/")) {
                getDefaultPage(t);
                return;
            }
            System.out.println("[access] " + path);
            getDefaultPage(t);
            return;

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
            sb.append("available processors : ").append(runtime.availableProcessors()).append("<br/>");            
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
         * @see
         * http://alvinalexander.com/blog/post/java/java-program-consume-all-memory-ram-on-computer
         */
        private void getKaboomPage(HttpExchange t) throws IOException {
            OutputStream os = t.getResponseBody();
            StringBuilder sb = new StringBuilder();

            sb.append("{\"title\":\"AH AH AH\", \"comment\":\"log at logs...\"}");
            System.out.println("[debug] " + sb.toString());
            t.sendResponseHeaders(200, sb.length());
            os.write(sb.toString().getBytes());
            os.close();
// tag::memory-monger[]
            //static final Map v = new WeakHashMap();
            Thread thread = new Thread() {
                public void run() {
                    int i = 0, j = 0;
                    Random ran = new Random(10);
                    int fill = ran.nextInt(15) * 120000;
                    int stack = 0;
                    while (true) {
                        i++;
                        j++;
                        if (i > 10000) {
                            i = 0;
                            // the Thread.sleep is here in order to allows
                            // to see the docker host swapping
                            try {
                                Thread.sleep(10);                 //1000 milliseconds is one second.
                                stack=stack+fill;
                                byte b[] = new byte[stack];
                                Object put = m.put(j, b);
                            } catch (InterruptedException ex) {
                                Thread.currentThread().interrupt();
                            }
                        }

                        //l.add(b);
                        //l2.add(b);
                        //System.out.println(j+" - free maxmemory : " + format.format(runtime.maxMemory()/ 1024));
                        //System.out.println(j+" - free memory    : " + format.format(runtime.freeMemory()/ 1024));
                    }
                }
            };
            thread.start();
// end::memory-monger[]

        }
    }

}
