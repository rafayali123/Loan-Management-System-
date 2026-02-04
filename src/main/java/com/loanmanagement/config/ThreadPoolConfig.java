package com.loanmanagement.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Configuration
public class ThreadPoolConfig {
    
    private static final Dotenv dotenv = Dotenv.load();
    
    @Bean(name = "notificationExecutor")
    public ExecutorService notificationExecutor() {
        int corePoolSize = Integer.parseInt(dotenv.get("THREAD_POOL_SIZE", "10"));
        int maxPoolSize = corePoolSize * 2;
        int queueCapacity = Integer.parseInt(dotenv.get("QUEUE_CAPACITY", "100"));
        
        return new ThreadPoolExecutor(
                corePoolSize,
                maxPoolSize,
                60,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(queueCapacity),
                r -> {
                    Thread t = new Thread(r, "NotificationThread-" + System.nanoTime());
                    t.setDaemon(false);
                    return t;
                }
        );
    }
}
