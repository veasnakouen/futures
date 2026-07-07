package com.mtp.stock.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String INVENTORY_EXCHANGE = "mtp.inventory.exchange";
    public static final String ITEM_CONSUMED_QUEUE = "mtp.stock.item.consumed.queue";
    public static final String ITEM_CONSUMED_ROUTING_KEY = "inventory.item.consumed";

    @Bean
    public Queue itemConsumedQueue() {
        return new Queue(ITEM_CONSUMED_QUEUE, true);
    }

    @Bean
    public TopicExchange inventoryExchange() {
        return new TopicExchange(INVENTORY_EXCHANGE);
    }

    @Bean
    public Binding bindingItemConsumed(Queue itemConsumedQueue, TopicExchange inventoryExchange) {
        return BindingBuilder.bind(itemConsumedQueue).to(inventoryExchange).with(ITEM_CONSUMED_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }


}
