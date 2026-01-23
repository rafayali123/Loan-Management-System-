package com.loanmanagement.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class MongoDBConfig extends AbstractMongoClientConfiguration {
    
    private static final Dotenv dotenv = Dotenv.load();
    
    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;
    
    @Value("${spring.data.mongodb.database}")
    private String databaseName;
    
    @Override
    protected String getDatabaseName() {
        String dbName = dotenv.get("MONGODB_DATABASE");
        return dbName != null ? dbName : "loan_management_db";
    }
    
    @Override
    public MongoClient mongoClient() {
        String uri = dotenv.get("MONGODB_URI");
        if (uri == null) {
            throw new IllegalArgumentException("MONGODB_URI not found in .env file");
        }
        return MongoClients.create(uri);
    }
    
    @Override
    protected boolean autoIndexCreation() {
        return true;
    }
}
