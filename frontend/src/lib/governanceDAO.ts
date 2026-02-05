/**
 * Phase 5: Decentralized Governance & Voting
 * 
 * Overview:
 * - Each Civic ID has one vote on protocol proposals
 * - Proposals: parameter changes, feature additions, treasury allocations
 * - Dual voting: on-chain (blockchain) + off-chain (server-side voting)
 * - Transparent voting record signed with Civic ID
 * - Governance token rewards for voting participation
 */

export interface Proposal {
  id: string;
  title: string;
  description: string;
  creator: string; // Civic ID of proposer
  status: 'draft' | 'published' | 'voting' | 'passed' | 'rejected' | 'executed';
  startTime: number;
  endTime: number;
  votesFor: number;
  votesAgainst: number;
  voters: Set<string>; // Civic IDs who voted
  votingType: 'binary' | 'multiple-choice' | 'quadratic';
  choices?: string[]; // for multiple-choice
  executionData?: unknown; // data to execute if passed
}

export interface Vote {
  proposalId: string;
  voterId: string; // Civic ID
  choice: 'yes' | 'no' | number; // choice index for multiple-choice
  weight?: number; // for quadratic voting
  timestamp: number;
  signature: string; // signed with voter's Civic ID
}

export interface GovernanceMetrics {
  totalProposals: number;
  activeProposals: number;
  totalVoters: number;
  averageVoterTurnout: number;
  governanceTokenBalance: number;
}

/**
 * Governance system for decentralized decision-making
 */
export class GovernanceDAO {
  private proposals: Map<string, Proposal>;
  private votes: Map<string, Vote[]>; // proposalId -> votes
  private voterTokens: Map<string, number>; // civicId -> token balance

  constructor() {
    this.proposals = new Map();
    this.votes = new Map();
    this.voterTokens = new Map();
  }

  /**
   * Create a new proposal
   */
  createProposal(
    title: string,
    description: string,
    creator: string,
    duration: number = 604800000 // 7 days in ms
  ): Proposal {
    const now = Date.now();
    const proposal: Proposal = {
      id: `prop_${Date.now()}_${Math.random()}`,
      title,
      description,
      creator,
      status: 'draft',
      startTime: now,
      endTime: now + duration,
      votesFor: 0,
      votesAgainst: 0,
      voters: new Set(),
      votingType: 'binary',
    };

    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  /**
   * Submit a vote on a proposal
   */
  submitVote(vote: Vote): boolean {
    const proposal = this.proposals.get(vote.proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (Date.now() > proposal.endTime) {
      throw new Error('Voting period ended');
    }

    if (proposal.voters.has(vote.voterId)) {
      throw new Error('Already voted on this proposal');
    }

    // Record vote
    if (!this.votes.has(vote.proposalId)) {
      this.votes.set(vote.proposalId, []);
    }
    this.votes.get(vote.proposalId)!.push(vote);

    // Update proposal tally
    if (vote.choice === 'yes') {
      proposal.votesFor++;
    } else if (vote.choice === 'no') {
      proposal.votesAgainst++;
    }

    proposal.voters.add(vote.voterId);

    return true;
  }

  /**
   * Finalize proposal voting and determine outcome
   */
  finalizeProposal(proposalId: string): boolean {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (Date.now() < proposal.endTime) {
      throw new Error('Voting period not ended');
    }

    const total = proposal.votesFor + proposal.votesAgainst;
    const passed = proposal.votesFor > proposal.votesAgainst;

    proposal.status = passed ? 'passed' : 'rejected';

    return passed;
  }

  /**
   * Get all votes on a proposal
   */
  getProposalVotes(proposalId: string): Vote[] {
    return this.votes.get(proposalId) || [];
  }

  /**
   * Check if address has voted
   */
  hasVoted(proposalId: string, voterId: string): boolean {
    const proposal = this.proposals.get(proposalId);
    return proposal?.voters.has(voterId) || false;
  }

  /**
   * Get governance metrics
   */
  getMetrics(): GovernanceMetrics {
    const now = Date.now();
    const activeProposals = Array.from(this.proposals.values()).filter(p => p.endTime > now).length;
    const totalVoters = new Set(Array.from(this.votes.values()).flat().map(v => v.voterId)).size;

    return {
      totalProposals: this.proposals.size,
      activeProposals,
      totalVoters,
      averageVoterTurnout: totalVoters / Math.max(1, this.voterTokens.size),
      governanceTokenBalance: 0, // server-side tracked
    };
  }

  /**
   * Get proposal by ID
   */
  getProposal(id: string): Proposal | undefined {
    return this.proposals.get(id);
  }

  /**
   * Get all active proposals
   */
  getActiveProposals(): Proposal[] {
    const now = Date.now();
    return Array.from(this.proposals.values()).filter(p => p.startTime < now && p.endTime > now && p.status === 'voting');
  }

  /**
   * Award governance tokens for participation
   */
  awardTokens(voterId: string, amount: number): void {
    const current = this.voterTokens.get(voterId) || 0;
    this.voterTokens.set(voterId, current + amount);
  }

  /**
   * Get voter token balance
   */
  getVoterBalance(voterId: string): number {
    return this.voterTokens.get(voterId) || 0;
  }
}

export default GovernanceDAO;
