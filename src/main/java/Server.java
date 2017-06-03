import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class Server {

    public static void main(String[] args) throws Exception {
        int port = 9091;
        if (0 < args.length) {
            port = Integer.parseInt(args[0]);
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new RootHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("SlideDev app listening on port " + port);
    }

    static class RootHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange t) throws IOException {
            String path = t.getRequestURI().getPath().trim();
            if (path.equals("/")) {
                path = "/slides.html";
            }
            if (path.contains("..")) {
                path = "/slides.html";
            }
            System.out.println("[access] " + path);

            String computePath = "/public" + path;

            InputStream resourceAsStream = Server.class.getResourceAsStream(computePath);

            if (resourceAsStream == null) {
                t.sendResponseHeaders(404, -1);
                System.out.println("[file not found] " + computePath);
                return;
            }

            Server.readContentWithMime(t, computePath);

        }
    }

    static void readContentWithMime(HttpExchange t, String path) throws IOException {

        if (path.endsWith(".jpg")
                || path.endsWith(".js")
                || path.endsWith(".ttf")
                || path.endsWith(".woff")
                || path.endsWith(".png")
                || path.endsWith(".json")
                || path.endsWith(".css")
                || path.endsWith(".html")) {
            final byte[] byteBuffer = new byte[1024 * 8];
            int read;
            OutputStream os = t.getResponseBody();
            ByteArrayOutputStream ous = new ByteArrayOutputStream();

            try {
                BufferedInputStream in = new BufferedInputStream(Server.class.getResourceAsStream(path));

                while ((read = in.read(byteBuffer)) >= 0) {
                    ous.write(byteBuffer, 0, read);
                }

            } catch (IOException e) {
                throw e;
            }
            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            t.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, HEAD");
            t.getResponseHeaders().add("Access-Control-Allow-Headers", "X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept");
            t.getResponseHeaders().add("Access-Control-Max-Age", "1728000");
            byte[] toByteArray = ous.toByteArray();
            t.sendResponseHeaders(200, toByteArray.length);
            os.write(toByteArray);
            os.close();
        }

    }

}
