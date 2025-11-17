import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";
import { google } from "@ai-sdk/google";

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbeddingModel("gemini-embedding-001"),
  embeddingDimension: 3072
})

export default rag