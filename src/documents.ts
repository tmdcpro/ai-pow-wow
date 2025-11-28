import fs from 'fs/promises';
import path from 'path';
import { ProjectDocument } from './types.js';

const DOCS_DIR = path.join(process.cwd(), 'docs');

// Document templates
const PRD_TEMPLATE = `# Product Requirements Document

## Overview
Brief description of the project and its purpose.

## Goals
- Primary goal 1
- Primary goal 2
- Primary goal 3

## User Stories
- As a [user type], I want [feature] so that [benefit]
- As a [user type], I want [feature] so that [benefit]

## Requirements

### Functional Requirements
1. [Requirement description]
2. [Requirement description]

### Non-Functional Requirements
1. Performance: [Target metrics]
2. Security: [Security requirements]
3. Scalability: [Scalability requirements]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Timeline
- Phase 1: [Description] (ETA: [Date])
- Phase 2: [Description] (ETA: [Date])
`;

const SPEC_TEMPLATE = `# Technical Specification

## Architecture Overview
High-level system architecture description.

## Technology Stack
- **Backend**: 
- **Frontend**: 
- **Database**: 
- **Infrastructure**: 

## Components

### Component 1
- **Purpose**: 
- **Interfaces**: 
- **Dependencies**:  

### Component 2
- **Purpose**: 
- **Interfaces**: 
- **Dependencies**: 

## Data Models
\`\`\`typescript
interface Example {
  id: string;
  // Add fields
}
\`\`\`

## API Design

### Endpoint 1
- **Method**: GET/POST/etc
- **Path**: /api/...
- **Request**: 
- **Response**: 

## Testing Strategy
- Unit tests: 
- Integration tests: 
- E2E tests: 

## Deployment
- Environment setup
- Build process
- Deployment steps
`;

// Ensure docs directory exists
async function ensureDocsDir() {
    try {
        await fs.access(DOCS_DIR);
    } catch {
        await fs.mkdir(DOCS_DIR, { recursive: true });
    }
}

export async function loadDocument(type: ProjectDocument['type']): Promise<ProjectDocument | null> {
    await ensureDocsDir();
    const filename = `${type.toUpperCase()}.md`;
    const filepath = path.join(DOCS_DIR, filename);

    try {
        const content = await fs.readFile(filepath, 'utf-8');
        const stats = await fs.stat(filepath);

        return {
            type,
            title: type === 'prd' ? 'Product Requirements' : type === 'spec' ? 'Technical Specification' : 'Custom Document',
            content,
            lastUpdated: stats.mtimeMs
        };
    } catch (error) {
        return null;
    }
}

export async function saveDocument(doc: ProjectDocument): Promise<void> {
    await ensureDocsDir();
    const filename = `${doc.type.toUpperCase()}.md`;
    const filepath = path.join(DOCS_DIR, filename);

    await fs.writeFile(filepath, doc.content, 'utf-8');
}

export async function createDefaultDocument(type: ProjectDocument['type']): Promise<ProjectDocument> {
    const templates = {
        prd: PRD_TEMPLATE,
        spec: SPEC_TEMPLATE,
        custom: '# Custom Document\n\nAdd your content here.\n'
    };

    const doc: ProjectDocument = {
        type,
        title: type === 'prd' ? 'Product Requirements' : type === 'spec' ? 'Technical Specification' : 'Custom Document',
        content: templates[type],
        lastUpdated: Date.now()
    };

    await saveDocument(doc);
    return doc;
}

export async function getAllDocuments(): Promise<ProjectDocument[]> {
    const docs: ProjectDocument[] = [];
    const types: ProjectDocument['type'][] = ['prd', 'spec', 'custom'];

    for (const type of types) {
        const doc = await loadDocument(type);
        if (doc) {
            docs.push(doc);
        }
    }

    return docs;
}
