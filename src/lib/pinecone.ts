import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import {downloadfilefromfirebase} from "./firebase-server"
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
    Document,
    RecursiveCharacterTextSplitter,
  } from "@pinecone-database/doc-splitter";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";


export const getPineconeClient = async()=>{
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });
}

type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };

export async function loadfileIntoPinecone(fileKey: string) {
    
    try {
      // 1. get the pdf -> downlaod and read from pdf
      console.log("downloading file to pinecone");
      const file_name = await downloadfilefromfirebase(fileKey);

      if (!file_name) {
          throw new Error("could not download from firebase");
      }

      const loader = new PDFLoader(file_name);
      const pages = (await loader.load()) as PDFPage[];
      
      // 2. split and segment the pdf

      const documents = await Promise.all(pages.map(prepareDocument));

      // 3. vectorise and embed individual documents
      const vectors = await Promise.all(documents.flat().map(embedDocument));

      // 4. upload to pinecone
      const client = await getPineconeClient();
      const pineconeIndex = await client.index("infoflow");
      const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

      console.log("inserting vectors into pinecone");
      await namespace.upsert(vectors);
      console.log("Vectors successfully inserted into Pinecone.");
      return documents[0];
    } catch (error) {
      console.error("Error during Pinecone insertion:", error);

        // Additional logging to identify which field causes the error
      

        throw error;
    }
        
    
}


async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings([doc.pageContent]); // Pass a single-element array
    const hash = md5(doc.pageContent);

    if (!embeddings || embeddings.length === 0 || !embeddings[0]) {
      console.log("Embeddings array is empty or undefined for document", doc);
      return null; // Return null or handle the case accordingly
    }

    // Flatten the embeddings array to match the PineconeRecord type
    const flattenedEmbeddings = embeddings.reduce((acc, val) => acc.concat(val), []);

    return {
      id: hash,
      values: flattenedEmbeddings,
      metadata: {
        text: doc.pageContent,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}




export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  const encodedStr = enc.encode(str);
  
  if (encodedStr.length <= bytes) {
    return str;
  }
  
  return new TextDecoder("utf-8").decode(encodedStr.slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}