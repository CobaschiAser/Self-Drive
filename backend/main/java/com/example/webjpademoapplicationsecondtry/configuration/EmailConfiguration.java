/*
package com.example.webjpademoapplicationsecondtry.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@ComponentScan(basePackages = { "com.example.webjpademoapplicationsecondtry.configuration" })
@PropertySource(value={"classpath:application.properties"})
public class EmailConfiguration {

    @Value("${spring.mail.host}")
    private String mailServerHost;

    @Value("${spring.mail.port}")
    private Integer mailServerPort = 587;

    @Value("${spring.mail.username}")
    private String mailServerUsername;

    @Value("${spring.mail.password}")
    private String mailServerPassword;

    @Bean
    public JavaMailSender getJavaMailSender() {


        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(mailServerHost);
        mailSender.setPort(mailServerPort);

        mailSender.setUsername(mailServerUsername);
        mailSender.setPassword(mailServerPassword);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }

}
*/
