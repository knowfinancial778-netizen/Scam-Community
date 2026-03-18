#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

/**
 * ReportAnalyzer - High Performance Pattern Matching (15% of Logic)
 * Designed for ultra-fast processing of bulk scam data.
 */

class ReportAnalyzer {
public:
    struct AnalysisResult {
        int patternCount;
        double confidenceScore;
        bool isFlagged;
    };

    AnalysisResult analyzeContent(const std::string& content) {
        std::vector<std::string> blacklist = {"0x", "seed phrase", "lottery", "winner", "urgent"};
        int count = 0;
        
        std::string lowerContent = content;
        std::transform(lowerContent.begin(), lowerContent.end(), lowerContent.begin(), ::tolower);

        for (const auto& pattern : blacklist) {
            size_t pos = lowerContent.find(pattern);
            while (pos != std::string::npos) {
                count++;
                pos = lowerContent.find(pattern, pos + pattern.length());
            }
        }

        bool flagged = count > 2;
        double score = (count * 25.0 > 100.0) ? 100.0 : count * 25.0;

        return {count, score, flagged};
    }
};

int main() {
    ReportAnalyzer analyzer;
    std::string sample = "Your crypto wallet seed phrase is needed for urgent verification.";
    
    auto result = analyzer.analyzeContent(sample);
    
    std::cout << "--- C++ High Performance Analysis ---" << std::endl;
    std::cout << "Patterns Detected: " << result.patternCount << std::endl;
    std::cout << "Confidence Score: " << result.confidenceScore << "%" << std::endl;
    std::cout << "Flagged for Review: " << (result.isFlagged ? "YES" : "NO") << std::endl;

    return 0;
}
