import { Octokit } from '@octokit/rest';

interface GitHubConfig {
    owner: string;
    repo: string;
    branch: string;
}

export class GitHubCMS {
    private octokit: Octokit;
    private config: GitHubConfig;

    constructor(token: string, config: GitHubConfig) {
        this.octokit = new Octokit({ auth: token });
        this.config = config;
    }

    /**
     * Save or update a file in the repository
     */
    async saveFile(path: string, content: string, message: string): Promise<void> {
        try {
            // Get current file SHA if it exists (needed for updates)
            let sha: string | undefined;
            try {
                const { data } = await this.octokit.repos.getContent({
                    owner: this.config.owner,
                    repo: this.config.repo,
                    path,
                    ref: this.config.branch,
                });

                if ('sha' in data) {
                    sha = data.sha;
                }
            } catch (error: any) {
                // File doesn't exist yet, that's okay
                if (error.status !== 404) throw error;
            }

            // Create or update the file
            await this.octokit.repos.createOrUpdateFileContents({
                owner: this.config.owner,
                repo: this.config.repo,
                path,
                message,
                content: Buffer.from(content).toString('base64'),
                branch: this.config.branch,
                sha, // Include SHA if updating existing file
            });

            console.log(`[GitHub CMS] File saved: ${path}`);
        } catch (error: any) {
            console.error('[GitHub CMS] Error saving file:', error);
            throw new Error(`Failed to save file to GitHub: ${error.message}`);
        }
    }

    /**
     * Delete a file from the repository
     */
    async deleteFile(path: string, message: string): Promise<void> {
        try {
            // Get file SHA (required for deletion)
            const { data } = await this.octokit.repos.getContent({
                owner: this.config.owner,
                repo: this.config.repo,
                path,
                ref: this.config.branch,
            });

            if (!('sha' in data)) {
                throw new Error('File not found or is a directory');
            }

            // Delete the file
            await this.octokit.repos.deleteFile({
                owner: this.config.owner,
                repo: this.config.repo,
                path,
                message,
                sha: data.sha,
                branch: this.config.branch,
            });

            console.log(`[GitHub CMS] File deleted: ${path}`);
        } catch (error: any) {
            console.error('[GitHub CMS] Error deleting file:', error);
            throw new Error(`Failed to delete file from GitHub: ${error.message}`);
        }
    }

    /**
     * Get file content from repository
     */
    async getFile(path: string): Promise<string> {
        try {
            const { data } = await this.octokit.repos.getContent({
                owner: this.config.owner,
                repo: this.config.repo,
                path,
                ref: this.config.branch,
            });

            if ('content' in data) {
                return Buffer.from(data.content, 'base64').toString('utf-8');
            }

            throw new Error('File is a directory or has no content');
        } catch (error: any) {
            console.error('[GitHub CMS] Error getting file:', error);
            throw new Error(`Failed to get file from GitHub: ${error.message}`);
        }
    }
}

// Singleton instance
let githubCMS: GitHubCMS | null = null;

export function getGitHubCMS(): GitHubCMS {
    if (!githubCMS) {
        const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
        const owner = import.meta.env.GITHUB_OWNER || process.env.GITHUB_OWNER || 'ibedestudio';
        const repo = import.meta.env.GITHUB_REPO || process.env.GITHUB_REPO || 'ibedes';
        const branch = import.meta.env.GITHUB_BRANCH || process.env.GITHUB_BRANCH || 'main';

        if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is required');
        }

        githubCMS = new GitHubCMS(token, { owner, repo, branch });
    }

    return githubCMS;
}
