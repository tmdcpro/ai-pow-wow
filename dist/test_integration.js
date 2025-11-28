import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";
async function main() {
    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"],
    });
    const client = new Client({
        name: "test-client",
        version: "1.0.0",
    }, {
        capabilities: {},
    });
    await client.connect(transport);
    console.log("Connected to server.");
    // List tools
    const tools = await client.request({ method: "tools/list" }, ListToolsResultSchema);
    console.log("Tools:", tools.tools.map((t) => t.name));
    // Call list_reviewers
    const reviewers = await client.callTool({
        name: "list_reviewers",
        arguments: {},
    });
    const content = reviewers.content;
    console.log("Reviewers:", JSON.parse(content[0].text));
    // Add a reviewer
    console.log("Adding a reviewer...");
    await client.callTool({
        name: "configure_reviewer",
        arguments: {
            name: "TestAgent",
            action: "add",
            focus: "Testing",
            systemPrompt: "You are a test agent.",
        },
    });
    // Verify addition
    const reviewers2 = await client.callTool({
        name: "list_reviewers",
        arguments: {},
    });
    const content2 = reviewers2.content;
    const list2 = JSON.parse(content2[0].text);
    console.log("Reviewers after add:", list2.map((r) => r.name));
    if (list2.find((r) => r.name === "TestAgent")) {
        console.log("SUCCESS: TestAgent found.");
    }
    else {
        console.error("FAILURE: TestAgent not found.");
        process.exit(1);
    }
    await client.close();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=test_integration.js.map