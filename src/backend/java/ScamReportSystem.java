import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * ScamReportSystem - Core Data Management (30% of Logic)
 * Architecture: Service-Oriented Logic for handling scam data integrity.
 */
public class ScamReportSystem {
    private List<Report> reports;

    public ScamReportSystem() {
        this.reports = new ArrayList<>();
    }

    public static class Report {
        private String id;
        private String type;
        private String description;
        private long timestamp;
        private boolean isVerified;

        public Report(String type, String description) {
            this.id = UUID.randomUUID().toString();
            this.type = type;
            this.description = description;
            this.timestamp = System.currentTimeMillis();
            this.isVerified = false;
        }

        // Getters and Setters
        public String getId() { return id; }
        public String getType() { return type; }
        public void setVerified(boolean verified) { isVerified = verified; }
    }

    public void submitReport(String type, String description) {
        Report newReport = new Report(type, description);
        reports.add(newReport);
        System.out.println("Java Engine: Processed and saved report " + newReport.getId());
    }

    public List<Report> getHighSeverityReports() {
        // Logic to filter reports using Java Stream API
        return reports.stream()
                .filter(r -> r.getType().equalsIgnoreCase("Crypto Scam"))
                .toList();
    }

    public static void main(String[] args) {
        System.out.println("ScamGuard Java Backend Initialized.");
        ScamReportSystem system = new ScamReportSystem();
        system.submitReport("Phishing", "Email from fake bank.");
    }
}
