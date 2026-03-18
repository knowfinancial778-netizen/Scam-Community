package com.scamguard.analytics;

import java.util.HashMap;
import java.util.Map;

/**
 * TextAnalyzer - Natural Language Analysis Layer
 * Part of the 100+ Feature Cluster
 */
public class TextAnalyzer {
    private Map<String, Integer> threatKeywords;

    public TextAnalyzer() {
        threatKeywords = new HashMap<>();
        threatKeywords.put("urgent", 5);
        threatKeywords.put("unauthorized", 8);
        threatKeywords.put("suspended", 10);
        threatKeywords.put("password", 4);
        threatKeywords.put("congratulations", 6);
    }

    public int calculateRiskScore(String text) {
        String lower = text.toLowerCase();
        int score = 0;
        for (String key : threatKeywords.keySet()) {
            if (lower.contains(key)) {
                score += threatKeywords.get(key);
            }
        }
        return score;
    }

    public static void main(String[] args) {
        TextAnalyzer analyzer = new TextAnalyzer();
        String sample = "Urgent: Your account is suspended due to unauthorized password attempt.";
        System.out.println("Java Risk Score: " + analyzer.calculateRiskScore(sample));
    }
}
