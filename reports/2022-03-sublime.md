![Sublime](/static/c4bf567ca4a1aa30dfa801e61881099e/4e333/sublime.jpg)

Sublime contest  
Findings & Analysis Report
============================================

#### 2022-07-14

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (2)](#high-risk-findings-2)
    
    *   [\[H-01\] `LenderPool`: Principal withdrawable is incorrectly calculated if start() is invoked with non-zero start fee](#h-01-lenderpool-principal-withdrawable-is-incorrectly-calculated-if-start-is-invoked-with-non-zero-start-fee)
    *   [\[H-02\] `PooledCreditLine`: termination likely fails because `_principleWithdrawable` is treated as shares](#h-02-pooledcreditline-termination-likely-fails-because-_principlewithdrawable-is-treated-as-shares)
*   [Medium Risk Findings (4)](#medium-risk-findings-4)
    
    *   [\[M-01\] Pool Credit Line May Not Able to Start When \_borrowAsset is Non ERC20 Compliant Tokens](#m-01-pool-credit-line-may-not-able-to-start-when-_borrowasset-is-non-erc20-compliant-tokens)
    *   [\[M-02\] Lack of access control allow anyone to `withdrawInterest()` for any lender](#m-02-lack-of-access-control-allow-anyone-to-withdrawinterest-for-any-lender)
    *   [\[M-03\] Potentially depositing at unfavorable rate since anyone can deposit the entire lenderPool to a known strategy at a pre-fixed time](#m-03-potentially-depositing-at-unfavorable-rate-since-anyone-can-deposit-the-entire-lenderpool-to-a-known-strategy-at-a-pre-fixed-time)
    *   [\[M-04\] Interest accrued could be zero for small decimal tokens](#m-04-interest-accrued-could-be-zero-for-small-decimal-tokens)
*   [Low Risk and Non-Critical Issues](#low-risk-and-non-critical-issues)
    
    *   [Codebase Impressions & Summary](#codebase-impressions--summary)
    *   [01 Discrepancy between recorded borrow amount in event and state update](#01-discrepancy-between-recorded-borrow-amount-in-event-and-state-update)
    *   [02 Use upgradeable version of OZ contracts](#02-use-upgradeable-version-of-oz-contracts)
    *   [03 `calculatePrincipalWithdrawable()` should return user balance for `CANCELLED` status](#03-calculateprincipalwithdrawable-should-return-user-balance-for-cancelled-status)
    *   [04 Use `continue` instead of `return` in `_beforeTokenTransfer()`](#04-use-continue-instead-of-return-in-_beforetokentransfer)
    *   [05 Token approval issues](#05-token-approval-issues)
    *   [06 Typos](#06-typos)
    *   [07 Definition mix-up in documentation](#07-definition-mix-up-in-documentation)
    *   [08 Inconsistent Naming](#08-inconsistent-naming)
*   [Gas Optimizations](#gas-optimizations)
    
    *   [G-01 Multiple mappings can be combined into a single mapping of a value to a struct](#g-01-multiple-mappings-can-be-combined-into-a-single-mapping-of-a-value-to-a-struct)
    *   [G-02 `++i`/`i++` should be `unchecked{++i}`/`unchecked{++i}` when it is not possible for them to overflow, as is the case when used in `for`\- and `while`\-loops](#g-02-ii-should-be-uncheckediuncheckedi-when-it-is-not-possible-for-them-to-overflow-as-is-the-case-when-used-in-for--and-while-loops)
    *   [G-03 `<array>.length` should not be looked up in every loop of a `for`\-loop](#g-03-arraylength-should-not-be-looked-up-in-every-loop-of-a-for-loop)
    *   [G-04 Using `calldata` instead of `memory` for read-only arguments in `external` functions saves gas](#g-04-using-calldata-instead-of-memory-for-read-only-arguments-in-external-functions-saves-gas)
    *   [G-05 `internal` functions only called once can be inlined to save gas](#g-05-internal-functions-only-called-once-can-be-inlined-to-save-gas)
    *   [G-06 Multiple `if`\-statements with mutually-exclusive conditions should be changed to `if`\-`else` statements](#g-06-multiple-if-statements-with-mutually-exclusive-conditions-should-be-changed-to-if-else-statements)
    *   [G-07 Use a more recent version of solidity](#g-07-use-a-more-recent-version-of-solidity)
    *   [G-08 Splitting `require()` statements that use `&&` saves gas](#g-08-splitting-require-statements-that-use--saves-gas)
    *   [G-09 `require()` or `revert()` statements that check input arguments should be at the top of the function](#g-09-require-or-revert-statements-that-check-input-arguments-should-be-at-the-top-of-the-function)
    *   [G-10 State variables should be cached in stack variables rather than re-reading them from storage](#g-10-state-variables-should-be-cached-in-stack-variables-rather-than-re-reading-them-from-storage)
    *   [G-11 Usage of `uints`/`ints` smaller than 32 bytes (256 bits) incurs overhead](#g-11-usage-of-uintsints-smaller-than-32-bytes-256-bits-incurs-overhead)
    *   [G-12 Functions guaranteed to revert when called by normal users can be marked `payable`](#g-12-functions-guaranteed-to-revert-when-called-by-normal-users-can-be-marked-payable)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Sublime smart contract system written in Solidity. The audit contest took place between March 29—March 31 2022.

[](#wardens)Wardens
-------------------

25 Wardens contributed reports to the Sublime contest:

1.  [hickuphh3](https://twitter.com/HickupH)
2.  [WatchPug](https://twitter.com/WatchPug_) ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
3.  kyliek
4.  [rayn](https://twitter.com/rayn731)
5.  [Dravee](https://twitter.com/JustDravee)
6.  [Meta0xNull](https://twitter.com/Meta0xNull)
7.  IllIllI
8.  kenta
9.  robee
10.  0x1f8b
11.  [defsec](https://twitter.com/defsec_)
12.  0xkatana
13.  [gzeon](https://twitter.com/gzeon)
14.  [sseefried](http://seanseefried.org/blog)
15.  [0v3rf10w](https://twitter.com/_0v3rf10w)
16.  hake
17.  0xDjango
18.  [BouSalman](https://twitter.com/BouSalman)
19.  dirk\_y
20.  [rfa](https://www.instagram.com/riyan_rfa/)
21.  [Funen](https://instagram.com/vanensurya)
22.  [Tomio](https://twitter.com/meidhiwirara)
23.  [0xNazgul](https://twitter.com/0xNazgul)
24.  [csanuragjain](https://twitter.com/csanuragjain)

This contest was judged by [HardlyDifficult](https://twitter.com/HardlyDifficult).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 6 unique vulnerabilities. Of these vulnerabilities, 2 received a risk rating in the category of HIGH severity and 4 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 18 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 19 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

[](#scope)Scope
===============

The code under review can be found within the [C4 Sublime contest repository](https://github.com/code-423n4/2022-03-sublime), and is composed of 3 smart contracts written in the Solidity programming language and includes 1,936 lines of Solidity code.

[](#severity-criteria)Severity Criteria
=======================================

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

*   Malicious Input Handling
*   Escalation of privileges
*   Arithmetic
*   Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

[](#high-risk-findings-2)High Risk Findings (2)
===============================================

[](#h-01-lenderpool-principal-withdrawable-is-incorrectly-calculated-if-start-is-invoked-with-non-zero-start-fee)[\[H-01\] `LenderPool`: Principal withdrawable is incorrectly calculated if start() is invoked with non-zero start fee](https://github.com/code-423n4/2022-03-sublime-findings/issues/19)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hickuphh3_

[LenderPool.sol#L594-L599](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L594-L599)  
[LenderPool.sol#L399-L404](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L399-L404)  

The `_principalWithdrawable` calculated will be more than expected if `_start()` is invoked with a non-zero start fee, because the borrow limit is reduced by the fee, resulting in `totalSupply[id]` not being 1:1 with the borrow limit.

    function _calculatePrincipalWithdrawable(uint256 _id, address _lender) internal view returns (uint256) {
      uint256 _borrowedTokens = pooledCLConstants[_id].borrowLimit;
      uint256 _totalLiquidityWithdrawable = _borrowedTokens.sub(POOLED_CREDIT_LINE.getPrincipal(_id));
      uint256 _principalWithdrawable = _totalLiquidityWithdrawable.mul(balanceOf(_lender, _id)).div(_borrowedTokens);
      return _principalWithdrawable;
    }

### [](#proof-of-concept)Proof of Concept

Assume the following conditions:

*   Alice, the sole lender, provided `100_000` tokens: `totalSupply[_id] = 100_000`
*   `borrowLimit = 99_000` because of a 1% startFee
*   Borrower borrowed zero amount

When Alice attempts to withdraw her tokens, the `_principalWithdrawable` amount is calculated as

    _borrowedTokens = 99_000
    _totalLiquidityWithdrawable = 99_000 - 0 = 99_000
    _principalWithdrawable = 99_000 * 100_000 / 99_000 = 100_000

This is more than the available principal amount of `99_000`, so the withdrawal will fail.

### [](#recommended-mitigation-steps)Recommended Mitigation Steps

One hack-ish way is to save the initial supply in `minBorrowAmount` (perhaps rename the variable to `minInitialSupply`) when the credit line is accepted, and replace `totalSupply[_id]` with it.

The other places where `minBorrowAmount` are used will not be affected by the change because:

*   startTime has been zeroed, so `start()` cannot be invoked (revert with error S1)
*   credit line status would have been changed to `ACTIVE` and cannot be changed back to `REQUESTED`, meaning the check below will be false regardless of the value of `minBorrowAmount`.
    
        _status == PooledCreditLineStatus.REQUESTED &&
        block.timestamp > pooledCLConstants[_id].startTime &&
        totalSupply[_id] < pooledCLConstants[_id].minBorrowAmount
    

Code amendment example:

    function _accept(uint256 _id, uint256 _amount) internal {
      ...
      // replace delete pooledCLConstants[_id].minBorrowAmount; with the following:
      pooledCLConstants[_id].minInitialSupply = totalSupply[_id];
    }
    
    // update comment in _withdrawLiquidity
    // Case 1: Pooled credit line never started because desired amount wasn't reached
    // state will never revert back to REQUESTED if credit line is accepted so this case is never run
    
    function _calculatePrincipalWithdrawable(uint256 _id, address _lender) internal view returns (uint256) {
      uint256 _borrowedTokens = pooledCLConstants[_id].borrowLimit;
      uint256 _totalLiquidityWithdrawable = _borrowedTokens.sub(POOLED_CREDIT_LINE.getPrincipal(_id));
      // totalSupply[id] replaced with minInitialSupply
      uint256 _principalWithdrawable = _totalLiquidityWithdrawable.mul(balanceOf(_lender, _id)).div(minInitialSupply);
      return _principalWithdrawable;
    }

In `terminate()`, the shares withdrawable can simply be `_sharesHeld`.

    function terminate(uint256 _id, address _to) external override onlyPooledCreditLine nonReentrant {
      address _strategy = pooledCLConstants[_id].borrowAssetStrategy;
      address _borrowAsset = pooledCLConstants[_id].borrowAsset;
      uint256 _sharesHeld = pooledCLVariables[_id].sharesHeld;
    
      SAVINGS_ACCOUNT.withdrawShares(_borrowAsset, _strategy, _to, _sharesHeld, false);
      delete pooledCLConstants[_id];
      delete pooledCLVariables[_id];
    }

**[ritik99 (Sublime) confirmed](https://github.com/code-423n4/2022-03-sublime-findings/issues/19)**

* * *

[](#h-02-pooledcreditline-termination-likely-fails-because-_principlewithdrawable-is-treated-as-shares)[\[H-02\] `PooledCreditLine`: termination likely fails because `_principleWithdrawable` is treated as shares](https://github.com/code-423n4/2022-03-sublime-findings/issues/21)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hickuphh3, also found by rayn and WatchPug_

[LenderPool.sol#L404-L406](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L404-L406)  

`_principalWithdrawable` is denominated in the borrowAsset, but subsequently treats it as the share amount to be withdrawn.

    // _notBorrowed = borrowAsset amount that isn't borrowed
    // totalSupply[_id] = ERC1155 total supply of _id
    // _borrowedTokens = borrower's specified borrowLimit
    uint256 _principalWithdrawable = _notBorrowed.mul(totalSupply[_id]).div(_borrowedTokens);
    
    SAVINGS_ACCOUNT.withdrawShares(_borrowAsset, _strategy, _to, _principalWithdrawable.add(_totalInterestInShares), false);

### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

The amount of shares to withdraw can simply be `_sharesHeld`.

Note that this comes with the assumption that `terminate()` is only called when the credit line is `ACTIVE` or `EXPIRED` (consider ensuring this condition on-chain), because `_sharesHeld` **excludes principal withdrawals,** so the function will fail once a lender withdraws his principal.

    function terminate(uint256 _id, address _to) external override onlyPooledCreditLine nonReentrant {
      address _strategy = pooledCLConstants[_id].borrowAssetStrategy;
      address _borrowAsset = pooledCLConstants[_id].borrowAsset;
      uint256 _sharesHeld = pooledCLVariables[_id].sharesHeld;
    
      SAVINGS_ACCOUNT.withdrawShares(_borrowAsset, _strategy, _to, _sharesHeld, false);
      delete pooledCLConstants[_id];
      delete pooledCLVariables[_id];
    }

**[ritik99 (Sublime) confirmed](https://github.com/code-423n4/2022-03-sublime-findings/issues/21)**

* * *

[](#medium-risk-findings-4)Medium Risk Findings (4)
===================================================

[](#m-01-pool-credit-line-may-not-able-to-start-when-_borrowasset-is-non-erc20-compliant-tokens)[\[M-01\] Pool Credit Line May Not Able to Start When \_borrowAsset is Non ERC20 Compliant Tokens](https://github.com/code-423n4/2022-03-sublime-findings/issues/27)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by Meta0xNull, also found by Dravee and kenta_

`IERC20(_borrowAsset).transfer(_to, _fee);`

If the USDT token is supported as \_borrowAsset, the unsafe version of .transfer(\_to, \_fee) may revert as there is no return value in the USDT token contract’s transfer() implementation (but the IERC20 interface expects a return value).

Function start() will break when \_borrowAsset is USDT or Non ERC20 Compliant Tokens. USDT is one of the most borrowed Asset in DEFI. This may cause losing a lot of potential users.

### [](#proof-of-concept-1)Proof of Concept

[LenderPool.sol#L327](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L327)  

### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

Use .safeTransfer instead of .transfer

`IERC20(_borrowAsset).safeTransfer(_to, _fee);`

**[ritik99 (Sublime) confirmed](https://github.com/code-423n4/2022-03-sublime-findings/issues/27)**

**[saxenism (Sublime) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/27):**

> [Shifted from transfer to safeTransfer sublime-finance/sublime-v1#372](https://github.com/sublime-finance/sublime-v1/pull/372)

* * *

[](#m-02-lack-of-access-control-allow-anyone-to-withdrawinterest-for-any-lender)[\[M-02\] Lack of access control allow anyone to `withdrawInterest()` for any lender](https://github.com/code-423n4/2022-03-sublime-findings/issues/59)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug_

[LenderPool.sol#L442](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L442)  

    function withdrawInterest(uint256 _id, address _lender) external nonReentrant {
        _withdrawInterest(_id, _lender);
    }
    
    function _withdrawInterest(uint256 _id, address _lender) internal {
        address _strategy = pooledCLConstants[_id].borrowAssetStrategy;
        address _borrowAsset = pooledCLConstants[_id].borrowAsset;
    
        (uint256 _interestToWithdraw, uint256 _interestSharesToWithdraw) = _calculateInterestToWithdraw(
            _id,
            _lender,
            _strategy,
            _borrowAsset
        );
        pooledCLVariables[_id].sharesHeld = pooledCLVariables[_id].sharesHeld.sub(_interestSharesToWithdraw);
    
        if (_interestToWithdraw != 0) {
            SAVINGS_ACCOUNT.withdraw(_borrowAsset, _strategy, _lender, _interestToWithdraw, false);
        }
        emit InterestWithdrawn(_id, _lender, _interestSharesToWithdraw);
    }

`withdrawInterest()` at a certain time may not be in the best interest of the specific `lender`.

It’s unconventional and can potentially cause leak of value for the `lender`. For example, the lender may still want to accrued more interest from the strategy.

### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

Change to:

    function withdrawInterest(uint256 _id, address _lender) external nonReentrant {
        require(msg.sender == _lender);
        _withdrawInterest(_id, _lender);
    }

**[ritik99 (Sublime) confirmed, but disagreed with Medium severity and commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/59#issuecomment-1096697498):**

> This is a valid suggestion. This allowed more flexibility from a composability/complexity perspective (for eg, an abstraction can be built that regularly withdraws interests for all lenders), hence the check was not put in place. We will add a check as suggested.
> 
> Since assets are not at risk (any withdrawn amount is still transferred to the correct lender), we would suggest lowering the severity to (1) low-risk.

**[HardlyDifficult (judge) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/59#issuecomment-1109952503):**

> Agree with medium risk as this seems to potentially leak some value for the lender.

**[saxenism (Sublime) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/59):**

> [Added access control for withdrawInterest in LenderPool sublime-finance/sublime-v1#374](https://github.com/sublime-finance/sublime-v1/pull/374)

* * *

[](#m-03-potentially-depositing-at-unfavorable-rate-since-anyone-can-deposit-the-entire-lenderpool-to-a-known-strategy-at-a-pre-fixed-time)[\[M-03\] Potentially depositing at unfavorable rate since anyone can deposit the entire lenderPool to a known strategy at a pre-fixed time](https://github.com/code-423n4/2022-03-sublime-findings/issues/64)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by kyliek_

[LenderPool.sol#L312](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L312)  
[LenderPool.sol#L336](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L336)  

An attacker could keep track of the `totalSupply` of each LenderPool to see if it is more than the `minBorrowAmount`. If so, at `startTime`, which is pre-announced, the attacker could call `start`, which will trigger `SAVINGS_ACCOUNT.deposit()` of the entire pool assets to mint LP tokens from external strategy, for example, in CompoundYield.

There is potentially a big sum depositing into a known Compound `cToken` contract at a known fixed time. Thus, the attacker could prepare the pool by depositing a fair sum first to lower the exchange rate before calling `start` in lenderPool. Hence, the deposit of the entire pool could be at a less favourable rate. This also applies to other potential strategies that are yet to be integrated. For example, in Curve pool, the attacker could prime the pool to be very imbalanced first and trigger the deposit and then harvest the arbitrage bonus by bringing the pool back to balance.

This attack can happen once only when the pooledCreditLine becomes active for each new lenderPool.

### [](#proof-of-concept-2)Proof of Concept

Step 1: When a new LenderPool started, note the borrowAsset token and its strategy target pool, as well as the collection period (i.e. start time)

Step 2: Closer to the start time block number, if `totalSupply` of the lenderPool is bigger than the `minBorrowAmount`, prepare a good sum to manipulate the target strategy pool for unfavorable exchange rate or arbitrage opportunity afterwords.

Step 3: Call `start` function before others, also put in his own address to `_to` to pocket the protocol fee.

Step 4: Depending on the strategy pool, harvest arbitrage. Or perhaps just withdraw one’s money from Step 2 for griefing.

### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

Add access control on start, e.g. only borrower can call through pooledCreditLine.

**[ritik99 (Sublime) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/64#issuecomment-1096704719):**

> We’re not sure how this leads to an attack. Fluctuation in yield is known and expected for most yield strategies like Compound. This, however, does not cause a loss of funds. An attacker instantly withdrawing their liquidity doesn’t affect others because interest rates are not “locked in” on the yield strategies. There are no exchanges taking place. Some more info on possible attacks might help.

**[HardlyDifficult (judge) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/64#issuecomment-1114990429):**

> Followed up with the warden and there appears to be a way to leak value by debalancing the pool before start and then rebalancing to extract some profit. This could be done with a flashbot for example to limit exposure.
> 
> The warden referenced [https://github.com/yearn/yearn-security/blob/master/disclosures/2021-02-04.md](https://github.com/yearn/yearn-security/blob/master/disclosures/2021-02-04.md) as an example of something similar.

**[ritik99 (Sublime) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/64#issuecomment-1129641308):**

> Had a discussion with the warden and the judge regarding this issue. For Compound in particular we checked that the exchange rate does not change upon deposits or withdrawals. Thus, sandwiching a call to `start()` couldn’t possibly lead to an attack vector. Additionally, because of another issue related to start fees #19, we decided to restrict `start()` to be callable only by the borrower.
> 
> However, the yield strategies that we whitelist might still be internally susceptible to this attack (for eg, [https://github.com/yearn/yearn-security/blob/master/disclosures/2021-02-04.md](https://github.com/yearn/yearn-security/blob/master/disclosures/2021-02-04.md)). We’ll be incorporating checks for this while onboarding strategies. Picking riskier strategies is optional and not enforced at the contract-level.

* * *

[](#m-04-interest-accrued-could-be-zero-for-small-decimal-tokens)[\[M-04\] Interest accrued could be zero for small decimal tokens](https://github.com/code-423n4/2022-03-sublime-findings/issues/10)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hickuphh3_

[PooledCreditLine.sol#L1215-L1221](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L1215-L1221)  

Interest is calculated as

    (_principal.mul(_borrowRate).mul(_timeElapsed).div(YEAR_IN_SECONDS).div(SCALING_FACTOR));

It is possible for the calculated interest to be zero for principal tokens with small decimals, such as [EURS](https://etherscan.io/token/0xdb25f211ab05b1c97d595516f45794528a807ad8) (2 decimals). Accumulated interest can therefore be zero by borrowing / repaying tiny amounts frequently.

### [](#proof-of-concept-3)Proof of Concept

Assuming a borrow interest rate of 5% (`5e17`) and principal borrow amount of `10_000` EURS (`10_000 * 1e2 = 1_000_000`), the interest rate calculated would be 0 if principal updates are made every minute (around 63s).

    // in this example, maximum duration for interest to be 0 is 63s
    1_000_000 * 5e17 * 63 / (86400 * 365) / 1e18 = 0.99885 // = 0

While plausible, this method of interest evasion isn’t as economical for tokens of larger decimals like USDC and USDT (6 decimals).

### [](#recommended-mitigation-steps-5)Recommended Mitigation Steps

Take caution when allowing an asset to be borrowed. Alternatively, scale the principal amount to precision (1e18) amounts.

**[ritik99 (Sublime) disagreed with High severity and commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/10#issuecomment-1090160861):**

> Tokens are whitelisted to ensure precision issues would not occur. Hence the issue is improbable and doesn’t occur for widely used tokens as the decimals are generally higher.

> Since there is no direct attack path (the steps required for this to occur would be: the token would first have to be whitelisted -> a loan request created using it -> lenders supply sufficient liquidity for this request to go active) and is, in essence, a value leak, we would suggest reducing the severity of the issue to (1) Low / (2) Medium.

**[HardlyDifficult (judge) decreased severity to Medium](https://github.com/code-423n4/2022-03-sublime-findings/issues/10)**

**[KushGoyal (Sublime) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/10):**

> [LIME-286 c4march-10 interest accrued could be zero for small decimal tokens sublime-finance/sublime-v1#391](https://github.com/sublime-finance/sublime-v1/pull/391)

* * *

[](#low-risk-and-non-critical-issues)Low Risk and Non-Critical Issues
=====================================================================

For this contest, 18 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-03-sublime-findings/issues/23) by **hickuphh3** received the top score from the judge.

_The following wardens also submitted reports: [IllIllI](https://github.com/code-423n4/2022-03-sublime-findings/issues/37), [kyliek](https://github.com/code-423n4/2022-03-sublime-findings/issues/75), [WatchPug](https://github.com/code-423n4/2022-03-sublime-findings/issues/61), [0x1f8b](https://github.com/code-423n4/2022-03-sublime-findings/issues/28), [robee](https://github.com/code-423n4/2022-03-sublime-findings/issues/3), [sseefried](https://github.com/code-423n4/2022-03-sublime-findings/issues/31), [BouSalman](https://github.com/code-423n4/2022-03-sublime-findings/issues/5), [Meta0xNull](https://github.com/code-423n4/2022-03-sublime-findings/issues/25), [rayn](https://github.com/code-423n4/2022-03-sublime-findings/issues/46), [0xkatana](https://github.com/code-423n4/2022-03-sublime-findings/issues/68), [Dravee](https://github.com/code-423n4/2022-03-sublime-findings/issues/33), [hake](https://github.com/code-423n4/2022-03-sublime-findings/issues/34), [0v3rf10w](https://github.com/code-423n4/2022-03-sublime-findings/issues/51), [0xDjango](https://github.com/code-423n4/2022-03-sublime-findings/issues/17), [dirk\_y](https://github.com/code-423n4/2022-03-sublime-findings/issues/8), [defsec](https://github.com/code-423n4/2022-03-sublime-findings/issues/79), and [gzeon](https://github.com/code-423n4/2022-03-sublime-findings/issues/63)._

[](#codebase-impressions--summary)Codebase Impressions & Summary
----------------------------------------------------------------

Overall, code quality for the PooledCreditLine contracts is great. Majority of the logic lies in the 2 contracts `PooledCreditLine` and `LenderPool`, with a small part on the `twitterVerifier` that handles verification via Twitter.

### [](#complexity)Complexity

The project is a little high in complexity because there are quite a number of possible states that a pooled credit line can have over its lifecycle, which means state handling has to be thoroughly scrutinised between transitions. The handling of interest rate calculations, borrower and lender shares accounting, and shares <> amounts conversions for integration with the saving account and strategies are other factors that raise the complexity. A lot of logic and functionality is thus packed into the 2 contracts that makes this 3 day contest feel underscoped.

### [](#documentation)Documentation

The [documentation provided](https://docs.sublime.finance/sublime-docs/the-protocol/pooled-credit-lines) was adequate in understanding the pool credit line functionality. Documentation about the termination functionality and start and protocol fees were unfortunately omitted. It would be great to add them in.

It would also have been great if inline comments were added to the `_calculateInterestToWithdraw()` and `_rebalanceInterestWithdrawn()` functions as I spent quite a bit of time deciphering what these functions were doing. Nevertheless, there were sufficient inline comments for the other parts of the contracts.

### [](#tests)Tests

Tests were unfortunately omitted because last minute changes were made to the contract and _“the tests couldn’t be modified to meet those changes in time for the contest. In order to not confuse people we decided it was best to remove the tests from the final release”._ It would have been a nice to have so that coverage can be run, and for us to quickly spin up POCs. I’m not sure how feasible it would have been to postpone the contest by a few days so that tests could be modified, but it would’ve been beneficial.

### [](#responsiveness)Responsiveness

I would like to commend Ritik for his quick responses to my DMs and question on the Discord channel! =)

[](#01-discrepancy-between-recorded-borrow-amount-in-event-and-state-update)\[01\] Discrepancy between recorded borrow amount in event and state update
-------------------------------------------------------------------------------------------------------------------------------------------------------

[PooledCreditLine.sol#L910](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L910)  
[PooledCreditLine.sol#L913](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L913)  
[PooledCreditLine.sol#L917](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L917)  

A protocol fee is taken whenever the borrower decides to borrow more tokens. The state update includes this protocol fee, but the amount emitted in the `BorrowedFromPooledCreditLine` event does not.

In my opinion, since the protocol fee should be included in the emitted event.

### [](#recommended-mitigation-steps-6)Recommended Mitigation Steps

    emit BorrowedFromPooledCreditLine(_id, _borrowedAmount.add(protocolFee));

[](#02-use-upgradeable-version-of-oz-contracts)\[02\] Use upgradeable version of OZ contracts
---------------------------------------------------------------------------------------------

[LenderPool.sol#L7-L9](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L7-L9)  
[PooledCreditLine.sol#L5-L7](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L5-L7)  

It is recommended to use the upgradeable version of OpenZeppelin contracts, as some contracts like ReentrancyGuard has a constructor method to [set the initial status as `_NOT_ENTERED = 1`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol#L37-L41). The status would currently defaults to `0`, which fortunately doesn’t break the `nonReentrant()` functionality.

Nevertheless, it would be recommended to use the upgradeable counterparts instead.

[](#03-calculateprincipalwithdrawable-should-return-user-balance-for-cancelled-status)\[03\] `calculatePrincipalWithdrawable()` should return user balance for `CANCELLED` status
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

[LenderPool.sol#L579-L592](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L579-L592)  

In the event the borrower cancels his borrow request, the principal withdrawable by the lender should be the liquidity he provided, but the function returns 0 instead.

### [](#recommended-mitigation-steps-7)Recommended Mitigation Steps

Add the `CANCELLED` case in the second if branch.

    else if (
      (
        _status == PooledCreditLineStatus.REQUESTED &&
        block.timestamp > pooledCLConstants[_id].startTime &&
        totalSupply[_id] < pooledCLConstants[_id].minBorrowAmount
      ) || (_status == PooledCreditLineStatus.CANCELLED)
    ) {
      return balanceOf(_lender, _id);
    }

[](#04-use-continue-instead-of-return-in-_beforetokentransfer)\[04\] Use `continue` instead of `return` in `_beforeTokenTransfer()`
-----------------------------------------------------------------------------------------------------------------------------------

[LenderPool.sol#L686-L688](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L686-L688)  

Should the contract be upgraded to use `_mintBatch()` in the future, the function will terminate prematurely after minting the first id.

### [](#recommended-mitigation-steps-8)Recommended Mitigation Steps

Replace `return` with `continue`.

    if (from == address(0)) {
      continue;
    }

[](#05-token-approval-issues)\[05\] Token approval issues
---------------------------------------------------------

*   `safeApprove()` has been deprecated in favour of `safeIncreaseAllowance()` and `safeDecreaseAllowance()`
*   using `approve()` might fail because some tokens (eg. USDT) don’t work when changing the allowance from an existing non-zero allowance value

### [](#recommended-mitigation-steps-9)Recommended Mitigation Steps

Update instances of `approve()` and `safeApprove()` to `safeIncreaseAllowance()`.

[](#06-typos)\[06\] Typos
-------------------------

Do a CTRL / CMD + F for the following errors:

`terminatd` → `terminated`

`pooleed` → `pooled`

`reqeuested` → `requested`

[](#07-definition-mix-up-in-documentation)\[07\] Definition mix-up in documentation
-----------------------------------------------------------------------------------

Reference: [https://docs.sublime.finance/sublime-docs/the-protocol/pooled-credit-lines#creating-a-pooled-credit-line](https://docs.sublime.finance/sublime-docs/the-protocol/pooled-credit-lines#creating-a-pooled-credit-line)

The definitions for the `Collateral Savings Strategy` and `Borrowed Asset Savings Strategy` have been mixed up.

### [](#recommended-mitigation-steps-10)Recommended Mitigation Steps

    9. Collateral Savings Strategy: Savings strategy where any collateral locked in by the borrower will be deployed, e.g., all WBTC deposited by the borrower as collateral could be locked in Aave to earn interest
    10. Borrowed Asset Savings Strategy: Savings strategy where any idle liquidity in the credit line will be deployed, e.g., all the idle USDC in the pooled credit line can be deployed to Compound

[](#08-inconsistent-naming)\[08\] Inconsistent Naming
-----------------------------------------------------

It would be great to have variable naming kept consistent for better readibility.

*   `_lendingShare`, `_liquidityProvided` to represent `balanceOf(msg.sender, _id);`
*   `withdrawnShares` vs `sharesWithdrawn`

**[ritik99 (Sublime) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/23#issuecomment-1097691717):**

> Thanks for the comments! We’ll definitely be updating our documentation to make it more detailed, both the external docs as well as inline comments.
> 
> All the issues mentioned by the warden are relevant. Usually, where approve() is used the allowance is used entirely in the subsequent transfer step, so it shouldn’t be an issue, although we’ll recheck all such instances. The report is of high quality.

**[HardlyDifficult (judge) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/23#issuecomment-1101881807):**

> For scoring, also including [Issue #20](https://github.com/code-423n4/2022-03-sublime-findings/issues/20).

**[HardlyDifficult (judge) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/23#issuecomment-1126080215):**

> This report is clear / easy to read. The intro is a great addition to provide some high level feedback.
> 
> *   01: Discrepancy between recorded borrow amount in event and state update  
>     Non-critical: This is somewhat arbitrary, but useful feedback to consider. Depending on the use case for consumers of this event, it may be useful to emit both \_borrowedAmount and protocolFee as separate params as well.
> *   02: Use upgradeable version of OZ contracts  
>     Non-critical: This is a best practice but as the warden points out it will not break anything in the current state. Switching to ReentrancyGuardUpgradeable would save gas on first usage.
> *   03: calculatePrincipalWithdrawable() should return user balance for CANCELLED status  
>     Low-risk: This impacts an external getter that in the original form may return misleading results after a request is canceled.
> *   04: Use continue instead of return in \_beforeTokenTransfer()  
>     Low-risk: If the `return` in this loop is executed than other tokenIds being transferred would skip the `require` checks and possibly some expected state updates. However given that the code currently does not batch mint this effectively has no impact but could crop up unexpectedly after an upgrade as the warden pointed out.
> *   05: Token approval issues  
>     Non-issue: Several wardens pointed to this concern. The way the contract is implemented, approval always resets back to 0 after the transfer so the failure scenario would not arise. It’s a good consideration though and something to be careful about to ensure that assumption holds true.
> *   06: Typos  
>     Non-critical: Always nice to fix up the spelling errors.
> *   07: Definition mix-up in documentation  
>     Non-critical: This is a nice catch to improve the documentation. Ramping up on a new protocol takes time and changes like this can help the reader create the right mental models.
> *   08: Inconsistent Naming  
>     Non-critical: Naming is always hard to do well. Improving internal consistency does help the reader.

* * *

[](#gas-optimizations)Gas Optimizations
=======================================

For this contest, 19 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-03-sublime-findings/issues/36) by **IllIllI** received the top score from the judge.

_The following wardens also submitted reports: [Dravee](https://github.com/code-423n4/2022-03-sublime-findings/issues/7), [robee](https://github.com/code-423n4/2022-03-sublime-findings/issues/2), [hickuphh3](https://github.com/code-423n4/2022-03-sublime-findings/issues/22), [defsec](https://github.com/code-423n4/2022-03-sublime-findings/issues/76), [0xkatana](https://github.com/code-423n4/2022-03-sublime-findings/issues/67), [rfa](https://github.com/code-423n4/2022-03-sublime-findings/issues/83), [Meta0xNull](https://github.com/code-423n4/2022-03-sublime-findings/issues/24), [gzeon](https://github.com/code-423n4/2022-03-sublime-findings/issues/62), [Funen](https://github.com/code-423n4/2022-03-sublime-findings/issues/69), [Tomio](https://github.com/code-423n4/2022-03-sublime-findings/issues/66), [0xNazgul](https://github.com/code-423n4/2022-03-sublime-findings/issues/16), [kenta](https://github.com/code-423n4/2022-03-sublime-findings/issues/80), [0v3rf10w](https://github.com/code-423n4/2022-03-sublime-findings/issues/53), [rayn](https://github.com/code-423n4/2022-03-sublime-findings/issues/47), [0x1f8b](https://github.com/code-423n4/2022-03-sublime-findings/issues/29), [csanuragjain](https://github.com/code-423n4/2022-03-sublime-findings/issues/15), [0xDjango](https://github.com/code-423n4/2022-03-sublime-findings/issues/18), and [hake](https://github.com/code-423n4/2022-03-sublime-findings/issues/35)._

[](#g-01-multiple-mappings-can-be-combined-into-a-single-mapping-of-a-value-to-a-struct)\[G-01\] Multiple mappings can be combined into a single mapping of a value to a struct
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/PooledCreditLine/LenderPool.sol (lines [109-121](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L109-L121))

        /**
         * @notice Mapping that stores constants for pooledCredit creditLine against it's id
         */
        mapping(uint256 => LenderPoolConstants) public pooledCLConstants;
        /**
         * @notice Mapping that stores variables for pooledCredit creditLine against it's id
         */
        mapping(uint256 => LenderPoolVariables) public pooledCLVariables;
        /**
         * @notice Mapping that stores total pooledCreditLine token supply against the creditLineId
         * @dev Since ERC1155 tokens don't support the totalSupply function it is maintained here
         */
        mapping(uint256 => uint256) public totalSupply;

2.  File: contracts/PooledCreditLine/PooledCreditLine.sol (lines [184-198](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L184-L198))

        /**
         * @notice stores the collateral shares in a pooled credit line per collateral strategy
         * @dev creditLineId => collateralShares
         **/
        mapping(uint256 => uint256) public depositedCollateralInShares;
    
        /**
         * @notice stores the variables to maintain a pooled credit line
         **/
        mapping(uint256 => PooledCreditLineVariables) public pooledCreditLineVariables;
    
        /**
         * @notice stores the constants related to a pooled credit line
         **/
        mapping(uint256 => PooledCreditLineConstants) public pooledCreditLineConstants;

[](#g-02-ii-should-be-uncheckediuncheckedi-when-it-is-not-possible-for-them-to-overflow-as-is-the-case-when-used-in-for--and-while-loops)\[G-02\] `++i`/`i++` should be `unchecked{++i}`/`unchecked{++i}` when it is not possible for them to overflow, as is the case when used in `for`\- and `while`\-loops
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/PooledCreditLine/LenderPool.sol (line [670](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L670))

            for (uint256 i; i < ids.length; ++i) {

[](#g-03-arraylength-should-not-be-looked-up-in-every-loop-of-a-for-loop)\[G-03\] `<array>.length` should not be looked up in every loop of a `for`\-loop
---------------------------------------------------------------------------------------------------------------------------------------------------------

Even memory arrays incur the overhead of bit tests and bit shifts to calculate the array length

1.  File: contracts/PooledCreditLine/LenderPool.sol (line [670](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L670))

            for (uint256 i; i < ids.length; ++i) {

[](#g-04-using-calldata-instead-of-memory-for-read-only-arguments-in-external-functions-saves-gas)\[G-04\] Using `calldata` instead of `memory` for read-only arguments in `external` functions saves gas
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/Verification/twitterVerifier.sol (line [88](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/Verification/twitterVerifier.sol#L88))

            string memory _name,

2.  File: contracts/Verification/twitterVerifier.sol (line [89](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/Verification/twitterVerifier.sol#L89))

            string memory _version

3.  File: contracts/Verification/twitterVerifier.sol (line [120](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/Verification/twitterVerifier.sol#L120))

            string memory _twitterId,

4.  File: contracts/Verification/twitterVerifier.sol (line [121](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/Verification/twitterVerifier.sol#L121))

            string memory _tweetId,

[](#g-05-internal-functions-only-called-once-can-be-inlined-to-save-gas)\[G-05\] `internal` functions only called once can be inlined to save gas
-------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/PooledCreditLine/LenderPool.sol (lines [694-698](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L694-L698))

        function _rebalanceInterestWithdrawn(
            uint256 id,
            uint256 amount,
            address from,
            address to

2.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [388](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L388))

        function _limitBorrowedInUSD(address _borrowToken, uint256 _borrowLimit, uint256 _minBorrowAmount) internal view {

3.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [671](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L671))

        function _createRequest(Request calldata _request) internal returns (uint256) {

4.  File: contracts/PooledCreditLine/PooledCreditLine.sol (lines [693-701](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L693-L701))

        function _notifyRequest(
            uint256 _id,
            address _lenderVerifier,
            address _borrowToken,
            address _borrowAssetStrategy,
            uint256 _borrowLimit,
            uint256 _minBorrowedAmount,
            uint256 _collectionPeriod,
            bool _areTokensTransferable

5.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [897](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L897))

        function _borrow(uint256 _id, uint256 _amount) internal {

6.  File: contracts/PooledCreditLine/PooledCreditLine.sol (lines [955-959](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L955-L959))

        function _withdrawBorrowAmount(
            address _asset,
            address _strategy,
            uint256 _amountInTokens
        ) internal returns (uint256) {

7.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [1019](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L1019))

        function _repay(uint256 _id, uint256 _amount) internal returns (uint256) {

8.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [1223](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L1223))

        function updateStateOnPrincipalChange(uint256 _id, uint256 _updatedPrincipal) internal {

[](#g-06-multiple-if-statements-with-mutually-exclusive-conditions-should-be-changed-to-if-else-statements)\[G-06\] Multiple `if`\-statements with mutually-exclusive conditions should be changed to `if`\-`else` statements
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

If two conditions are the same, their blocks should be combined

1.  File: contracts/PooledCreditLine/LenderPool.sol (lines [676-688](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L676-L688))

                if (from == address(0)) {
                    totalSupply[id] = totalSupply[id].add(amount);
                } else if (to == address(0)) {
                    uint256 supply = totalSupply[id];
                    require(supply >= amount, 'T3');
                    totalSupply[id] = supply - amount;
                } else {
                    require(pooledCLConstants[id].areTokensTransferable, 'T4');
                }
    
                if (from == address(0)) {
                    return;
                }

[](#g-07-use-a-more-recent-version-of-solidity)\[G-07\] Use a more recent version of solidity
---------------------------------------------------------------------------------------------

Use a solidity version of at least 0.8.0 to get overflow protection without `SafeMath` Use a solidity version of at least 0.8.2 to get compiler automatic inlining Use a solidity version of at least 0.8.3 to get better struct packing and cheaper multiple storage reads Use a solidity version of at least 0.8.4 to get custom errors, which are cheaper at deployment than `revert()/require()` strings Use a solidity version of at least 0.8.10 to have external calls skip contract existence checks if the external call has a return value

1.  File: contracts/Verification/twitterVerifier.sol (line [2](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/Verification/twitterVerifier.sol#L2))

    pragma solidity 0.7.6;

2.  File: contracts/PooledCreditLine/LenderPool.sol (line [2](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/LenderPool.sol#L2))

    pragma solidity 0.7.6;

3.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [2](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L2))

    pragma solidity 0.7.6;

[](#g-08-splitting-require-statements-that-use--saves-gas)\[G-08\] Splitting `require()` statements that use `&&` saves gas
---------------------------------------------------------------------------------------------------------------------------

See [this issue](https://github.com/code-423n4/2022-01-xdefi-findings/issues/128) for an example

1.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [642](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L642))

            require(_request.borrowAsset != address(0) && _request.collateralAsset != address(0), 'R4');

[](#g-09-require-or-revert-statements-that-check-input-arguments-should-be-at-the-top-of-the-function)\[G-09\] `require()` or `revert()` statements that check input arguments should be at the top of the function
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [394](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L394))

            require(_minBorrowAmount <= _borrowLimit, 'ILB2');

2.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [778](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L778))

            require(_amount <= _withdrawableCollateral, 'WC1');

3.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [900](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L900))

            require(_amount <= calculateBorrowableAmount(_id), 'B3');

[](#g-10-state-variables-should-be-cached-in-stack-variables-rather-than-re-reading-them-from-storage)\[G-10\] State variables should be cached in stack variables rather than re-reading them from storage
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The instances below point to the second access of a state variable within a function. Less obvious optimizations include having local storage variables of mappings within state variable mappings or mappings within state variable structs, having local storage variables of structs within mappings, or having local caches of state variable contracts/addresses.

See [original submission](https://github.com/code-423n4/2022-03-sublime-findings/issues/36) for instances.

[](#g-11-usage-of-uintsints-smaller-than-32-bytes-256-bits-incurs-overhead)\[G-11\] Usage of `uints`/`ints` smaller than 32 bytes (256 bits) incurs overhead
------------------------------------------------------------------------------------------------------------------------------------------------------------

> When using elements that are smaller than 32 bytes, your contract’s gas usage may be higher. This is because the EVM operates on 32 bytes at a time. Therefore, if the element is smaller than that, the EVM must use more operations in order to reduce the size of the element from 32 bytes to the desired size.

[https://docs.soliditylang.org/en/v0.8.11/internals/layout\_in\_storage.html](https://docs.soliditylang.org/en/v0.8.11/internals/layout_in_storage.html) Use a larger size then downcast where needed

1.  File: contracts/Verification/twitterVerifier.sol (line [117](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/Verification/twitterVerifier.sol#L117))

            uint8 _v,

2.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [164](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L164))

            uint128 borrowLimit;

3.  File: contracts/PooledCreditLine/PooledCreditLine.sol (line [165](https://github.com/sublime-finance/sublime-v1/blob/46536a6d25df4264c1b217bd3232af30355dcb95/contracts/PooledCreditLine/PooledCreditLine.sol#L165))

            uint128 borrowRate;

[](#g-12-functions-guaranteed-to-revert-when-called-by-normal-users-can-be-marked-payable)\[G-12\] Functions guaranteed to revert when called by normal users can be marked `payable`
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function. Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided.

See [original submission](https://github.com/code-423n4/2022-03-sublime-findings/issues/36) for instances.

**[ritik99 (Sublime) commented](https://github.com/code-423n4/2022-03-sublime-findings/issues/36#issuecomment-1097107013):**

> All suggestions are valid and the report is highly detailed.

* * *

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk10 { color: #4EC9B0; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }