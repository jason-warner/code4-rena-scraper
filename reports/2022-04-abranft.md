![Abracadabra Money](/static/92d790a4104ef8c81c92d5516ab98546/4e333/Abra.jpg)

AbraNFT contest  
Findings & Analysis Report
============================================

#### 2022-07-18

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (5)](#high-risk-findings-5)
    
    *   [\[H-01\] Avoidance of Liquidation Via Malicious Oracle](#h-01-avoidance-of-liquidation-via-malicious-oracle)
    *   [\[H-02\] The return value `success` of the get function of the INFTOracle interface is not checked](#h-02-the-return-value-success-of-the-get-function-of-the-inftoracle-interface-is-not-checked)
    *   [\[H-03\] Critical Oracle Manipulation Risk by Lender](#h-03-critical-oracle-manipulation-risk-by-lender)
    *   [\[H-04\] Lender is able to seize the collateral by changing the loan parameters](#h-04-lender-is-able-to-seize-the-collateral-by-changing-the-loan-parameters)
    *   [\[H-05\] Mistake while checking LTV to lender accepted LTV](#h-05-mistake-while-checking-ltv-to-lender-accepted-ltv)
*   [Medium Risk Findings (1)](#medium-risk-findings-1)
    
    *   [\[M-01\] Reentrancy at \_requestLoan allows requesting a loan without supplying collateral](#m-01-reentrancy-at-_requestloan-allows-requesting-a-loan-without-supplying-collateral)
*   [Low Risk and Non-Critical Issues](#low-risk-and-non-critical-issues)
    
    *   [L-01 Should ensure loan collateral is not immediately seizable](#l-01-should-ensure-loan-collateral-is-not-immediately-seizable)
    *   [L-02 Pairs do not implement `ERC721TokenReceiver`](#l-02-pairs-do-not-implement-erc721tokenreceiver)
    *   [L-03 Incorrect comments](#l-03-incorrect-comments)
    *   [L-04 Calls incorrectly allow non-zero `msg.value`](#l-04-calls-incorrectly-allow-non-zero-msgvalue)
    *   [L-05 Missing checks for `address(0x0)` when assigning values to `address` state variables](#l-05-missing-checks-for-address0x0-when-assigning-values-to-address-state-variables)
    *   [L-06 `ecrecover` not checked for zero result](#l-06-ecrecover-not-checked-for-zero-result)
    *   [N-01 Consider supporting CryptoPunks and EtherRocks](#n-01-consider-supporting-cryptopunks-and-etherrocks)
    *   [N-02 Contracts should be refactored to extend a base contract with the common functionality](#n-02-contracts-should-be-refactored-to-extend-a-base-contract-with-the-common-functionality)
    *   [N-03 Some compilers can’t handle two different contracts with the same name](#n-03-some-compilers-cant-handle-two-different-contracts-with-the-same-name)
    *   [N-04 Calls to `BoringMath.to128()` are redundant](#n-04-calls-to-boringmathto128-are-redundant)
    *   [N-05 `require()`/`revert()` statements should have descriptive reason strings](#n-05-requirerevert-statements-should-have-descriptive-reason-strings)
    *   [N-06 `public` functions not called by the contract should be declared `external` instead](#n-06-public-functions-not-called-by-the-contract-should-be-declared-external-instead)
    *   [N-07 Interfaces should be moved to separate files](#n-07-interfaces-should-be-moved-to-separate-files)
    *   [N-08 `2**<n> - 1` should be re-written as `type(uint<n>).max`](#n-08-2n---1-should-be-re-written-as-typeuintnmax)
    *   [N-09 `constant`s should be defined rather than using magic numbers](#n-09-constants-should-be-defined-rather-than-using-magic-numbers)
    *   [N-10 Numeric values having to do with time should use time units for readability](#n-10-numeric-values-having-to-do-with-time-should-use-time-units-for-readability)
    *   [N-11 Use a more recent version of solidity](#n-11-use-a-more-recent-version-of-solidity)
    *   [N-12 Constant redefined elsewhere](#n-12-constant-redefined-elsewhere)
    *   [N-13 Fee mechanics should be better described](#n-13-fee-mechanics-should-be-better-described)
    *   [N-14 Typos](#n-14-typos)
    *   [N-15 NatSpec is incomplete](#n-15-natspec-is-incomplete)
    *   [N-16 Event is missing `indexed` fields](#n-16-event-is-missing-indexed-fields)
    *   [N-17 A best practice is to check for signature malleability](#n-17-a-best-practice-is-to-check-for-signature-malleability)
    *   [N-18 Consider making contract `Pausable` to have some protection against ongoing exploits](#n-18-consider-making-contract-pausable-to-have-some-protection-against-ongoing-exploits)
    *   [N-19 States/flags should use `Enum`s rather than separate constants](#n-19-statesflags-should-use-enums-rather-than-separate-constants)
    *   [N-20 Non-exploitable re-entrancies](#n-20-non-exploitable-re-entrancies)
    *   [N-21 Comments should be enforced by `require()`s](#n-21-comments-should-be-enforced-by-requires)
*   [Gas Optimizations](#gas-optimizations)
    
    *   [Table of Contents](#table-of-contents)
    *   [G-01 `NFTPair.init` and `NFTPairWithOracle.init`: Storage usage optimization](#g-01-nftpairinit-and-nftpairwithoracleinit-storage-usage-optimization)
    *   [G-02 Caching storage values in memory](#g-02-caching-storage-values-in-memory)
    *   [G-03 Splitting `require()` statements that use `&&` saves gas](#g-03-splitting-require-statements-that-use--saves-gas)
    *   [G-04 An array’s length should be cached to save gas in for-loops](#g-04-an-arrays-length-should-be-cached-to-save-gas-in-for-loops)
    *   [G-05 `++i` costs less gas compared to `i++` or `i += 1`](#g-05-i-costs-less-gas-compared-to-i-or-i--1)
    *   [G-06 Public functions to external](#g-06-public-functions-to-external)
    *   [G-07 `updateLoanParams()`: Replace `memory` with `calldata` and `public` with `external`](#g-07-updateloanparams-replace-memory-with-calldata-and-public-with-external)
    *   [G-08 `updateLoanParams()`: Copying in memory can be more expensive than using the `storage` keyword](#g-08-updateloanparams-copying-in-memory-can-be-more-expensive-than-using-the-storage-keyword)
    *   [G-09 `_lend()`: Copying in memory can be more expensive than using the `storage` keyword](#g-09-_lend-copying-in-memory-can-be-more-expensive-than-using-the-storage-keyword)
    *   [G-10 No need to explicitly initialize variables with default values](#g-10-no-need-to-explicitly-initialize-variables-with-default-values)
    *   [G-11 Reduce the size of error messages (Long revert Strings)](#g-11-reduce-the-size-of-error-messages-long-revert-strings)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the AbraNFT smart contract system written in Solidity. The audit contest took place between April 27—May 1 2022.

[](#wardens)Wardens
-------------------

72 Wardens contributed reports to the AbraNFT contest:

1.  [gzeon](https://twitter.com/gzeon)
2.  hyh
3.  BowTiedWardens (BowTiedHeron, BowTiedPickle, [m4rio\_eth](BowTiedETHernal), [Dravee](https://twitter.com/JustDravee), and BowTiedFirefox)
4.  [WatchPug](https://twitter.com/WatchPug_) ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
5.  [catchup](https://twitter.com/catchup22)
6.  IllIllI
7.  [Ruhum](https://twitter.com/0xruhum)
8.  [plotchy](https://twitter.com/plotchy)
9.  GimelSec ([rayn](https://twitter.com/rayn731) and sces60107)
10.  [kenzo](https://twitter.com/KenzoAgada)
11.  cccz
12.  horsefacts
13.  scaraven
14.  [berndartmueller](https://twitter.com/berndartmueller)
15.  0x1337
16.  0xf15ers (remora and twojoy)
17.  [antonttc](https://github.com/antoncoding)
18.  AuditsAreUS
19.  [Czar102](https://twitter.com/_Czar102)
20.  [joestakey](https://twitter.com/JoeStakey)
21.  [bobi](https://twitter.com/VladToie/)
22.  reassor
23.  [defsec](https://twitter.com/defsec_)
24.  robee
25.  [z3s](https://github.com/z3s/)
26.  oyc\_109
27.  [pauliax](https://twitter.com/SolidityDev)
28.  simon135
29.  delfin454000
30.  [CertoraInc](https://twitter.com/CertoraInc) (egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, and shakedwinder)
31.  [Funen](https://instagram.com/vanensurya)
32.  samruna
33.  kenta
34.  0x1f8b
35.  [MaratCerby](https://twitter.com/MaratCerby)
36.  0xkatana
37.  bobirichman
38.  sikorico
39.  m9800
40.  ilan
41.  [broccolirob](https://twitter.com/0xbroccolirob)
42.  unforgiven
43.  gs8nrv
44.  [jah](https://twitter.com/jah_s3)
45.  hubble (ksk2345 and shri4net)
46.  kebabsec (okkothejawa and [FlameHorizon](https://twitter.com/FlameHorizon1))
47.  [throttle](https://twitter.com/Throt7le)
48.  mics
49.  0xDjango
50.  [Tomio](https://twitter.com/meidhiwirara)
51.  slywaters
52.  [0xNazgul](https://twitter.com/0xNazgul)
53.  [Tadashi](https://github.com/htadashi)
54.  NoamYakov
55.  sorrynotsorry
56.  TrungOre
57.  [Kulk0](https://twitter.com/DavidKulman3)
58.  [fatherOfBlocks](https://twitter.com/father0fBl0cks)
59.  Hawkeye (0xwags and 0xmint)

This contest was judged by [0xean](https://github.com/0xean).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay) and [liveactionllama](https://twitter.com/liveactionllama).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 6 unique vulnerabilities. Of these vulnerabilities, 5 received a risk rating in the category of HIGH severity and 1 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 45 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 33 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

[](#scope)Scope
===============

The code under review can be found within the [C4 AbraNFT contest repository](https://github.com/code-423n4/2022-04-abranft), and is composed of 2 smart contracts written in the Solidity programming language and includes 1,333 lines of Solidity code.

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

[](#high-risk-findings-5)High Risk Findings (5)
===============================================

[](#h-01-avoidance-of-liquidation-via-malicious-oracle)[\[H-01\] Avoidance of Liquidation Via Malicious Oracle](https://github.com/code-423n4/2022-04-abranft-findings/issues/136)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by BowTiedWardens, also found by gzeon, and hyh_

Issue: Arbitrary oracles are permitted on construction of loans, and there is no check that the lender agrees to the used oracle.

Consequences: A borrower who requests a loan with a malicious oracle can avoid legitimate liquidation.

### [](#proof-of-concept)Proof of Concept

*   Borrower requests loan with an malicious oracle
*   Lender accepts loan unknowingly
*   Borrowers’s bad oracle is set to never return a liquidating rate on `oracle.get` call.
*   Lender cannot call `removeCollateral` to liquidate the NFT when it should be allowed, as it will fail the check on [L288](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L288)
*   To liquidate the NFT, the lender would have to whitehat along the lines of H-01, by atomically updating to an honest oracle and calling `removeCollateral`.

### [](#mitigations)Mitigations

*   Add `require(params.oracle == accepted.oracle)` as a condition in `_lend`
*   Consider only allowing whitelisted oracles, to avoid injection of malicious oracles at the initial loan request stage

**[cryptolyndon (AbraNFT) confirmed and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/136#issuecomment-1119136462):**

> Oracle not compared to lender agreed value: confirmed, and I think this is the first time I’ve seen this particular vulnerability pointed out. Not marking the entire issue as a duplicate for that reason.
> 
> Oracle not checked on loan request: Not an issue, first reported in #62.

* * *

[](#h-02-the-return-value-success-of-the-get-function-of-the-inftoracle-interface-is-not-checked)[\[H-02\] The return value `success` of the get function of the INFTOracle interface is not checked](https://github.com/code-423n4/2022-04-abranft-findings/issues/21)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cccz, also found by Ruhum, catchup, IllIllI, WatchPug, berndartmueller, plotchy, antonttc, hyh, and 0xf15ers_

        function get(address pair, uint256 tokenId) external returns (bool success, uint256 rate);

The get function of the INFTOracle interface returns two values, but the success value is not checked when used in the NFTPairWithOracle contract. When success is false, NFTOracle may return stale data.

### [](#proof-of-concept-1)Proof of Concept

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/interfaces/INFTOracle.sol#L10-L10](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/interfaces/INFTOracle.sol#L10-L10)

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L287-L287](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L287-L287)

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L321-L321](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L321-L321)

### [](#recommended-mitigation-steps)Recommended Mitigation Steps

    (bool success, uint256 rate) = loanParams.oracle.get(address(this), tokenId);
    require(success);

**[cryptolyndon (AbraNFT) confirmed and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/21#issuecomment-1115757383):**

> Agreed, and the first report of this issue.

**[0xean (judge) increased severity to High and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/21#issuecomment-1133443334):**

> I am upgrading this to High severity.
> 
> This is a direct path to assets being lost.
> 
> `3 — High: Assets can be stolen/lost/compromised directly (or indirectly if there is a valid attack path that does not have hand-wavy hypotheticals).`

* * *

[](#h-03-critical-oracle-manipulation-risk-by-lender)[\[H-03\] Critical Oracle Manipulation Risk by Lender](https://github.com/code-423n4/2022-04-abranft-findings/issues/37)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0x1337, also found by catchup, cccz, kenzo, GimelSec, BowTiedWardens, gzeon, horsefacts, and hyh_

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L286-L288](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L286-L288)

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L200-L211](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L200-L211)

The intended use of the Oracle is to protect the lender from a drop in the borrower’s collateral value. If the collateral value goes up significantly and higher than borrowed amount + interest, the lender should not be able to seize the collateral at the expense of the borrower. However, in the `NFTPairWithOracle` contract, the lender could change the Oracle once a loan is outstanding, and therefore seize the collateral at the expense of the borrower, if the actual value of the collateral has increased significantly. This is a critical risk because borrowers asset could be lost to malicious lenders.

### [](#proof-of-concept-2)Proof of Concept

In `NFTPairWithOracle`, the `params` are set by the `borrower` when they call `requestLoan()`, including the Oracle used. Once a lender agrees with the parameters and calls the `lend()` function, the `loan.status` changes to `LOAN_OUTSTANDING`.

Then, the lender can call the `updateLoanParams()` function and pass in its own `params` including the Oracle used. The `require` statement from line 205 to 211 does not check if `params.oracle` and `cur.oracle` are the same. A malicious lender could pass in his own `oracle` after the loan becomes outstanding, and the change would be reflected in line 221.

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L200-L211](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L200-L211)

In a situation where the actual value of the collateral has gone up by a lot, exceeding the amount the lender is owed (principal + interest), the lender would have an incentive to seize the collateral. If the Oracle is not tampered with, lender should not be able to do this, because line 288 should fail. But a lender could freely change Oracle once the loan is outstanding, then a tampered Oracle could produce a very low `rate` in line 287 such that line 288 would pass, allowing the lender to seize the collateral, hurting the borrower.

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L286-L288](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L286-L288)

### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

Once a loan is agreed to, the oracle used should not change. I’d recommend adding a check in the `require` statement in line 205 - 211 that `params.oracle == cur.oracle`

**[cryptolyndon (AbraNFT) confirmed and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/37#issuecomment-1118104950):**

> Confirmed, this is bad. First report of this particular exploit.

* * *

[](#h-04-lender-is-able-to-seize-the-collateral-by-changing-the-loan-parameters)[\[H-04\] Lender is able to seize the collateral by changing the loan parameters](https://github.com/code-423n4/2022-04-abranft-findings/issues/51)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by Ruhum, also found by IllIllI, WatchPug, BowTiedWardens, gzeon, plotchy, and scaraven_

[https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L198-L223](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L198-L223)

[https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L200-L212](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L200-L212)

[https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L288](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L288)

The lender should only be able to seize the collateral if:

*   the borrower didn’t repay in time
*   the collateral loses too much of its value

But, the lender is able to seize the collateral at any time by modifying the loan parameters.

### [](#proof-of-concept-3)Proof of Concept

The [`updateLoanParams()`](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L198-L223) allows the lender to modify the parameters of an active loan in favor of the borrower. But, by setting the `ltvBPS` value to `0` they are able to seize the collateral.

If `ltvBPS` is `0` the following require statement in `removeCollateral()` will always be true:

[https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L288](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L288)

`rate * 0 / BPS < amount` is always `true`.

That allows the lender to seize the collateral although its value didn’t decrease nor did the time to repay the loan come.

So the required steps are:

1.  lend the funds to the borrower
2.  call `updateLoanParams()` to set the `ltvBPS` value to `0`
3.  call `removeCollateral()` to steal the collateral from the contract

### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

Don’t allow `updateLoanParams()` to change the `ltvBPS` value.

**[cryptolyndon (AbraNFT) confirmed and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/51#issuecomment-1118132221):**

> Confirmed, and the first to report this particular exploit.

* * *

[](#h-05-mistake-while-checking-ltv-to-lender-accepted-ltv)[\[H-05\] Mistake while checking LTV to lender accepted LTV](https://github.com/code-423n4/2022-04-abranft-findings/issues/55)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by catchup, also found by WatchPug, gzeon, and hyh_

It comments in the `\_lend()` function that lender accepted conditions must be at least as good as the borrower is asking for. The line which checks the accepted LTV (lender’s LTV) against borrower asking LTV is: `params.ltvBPS >= accepted.ltvBPS`, This means lender should be offering a lower LTV, which must be the opposite way around. I think this may have the potential to strand the lender, if he enters a lower LTV. For example borrower asking LTV is 86%. However, lender enters his accepted LTV as 80%. lend() will execute with 86% LTV and punish the lender, whereas it should revert and acknowledge the lender that his bid is not good enough.

### [](#proof-of-concept-4)Proof of Concept

[https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L316](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L316)

### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

The condition should be changed as: `params.ltvBPS <= accepted.ltvBPS`,

**[cryptolyndon (AbraNFT) confirmed and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/55#issuecomment-1118145958):**

> Confirmed, and the first to note this particular issue.

* * *

[](#medium-risk-findings-1)Medium Risk Findings (1)
===================================================

[](#m-01-reentrancy-at-_requestloan-allows-requesting-a-loan-without-supplying-collateral)[\[M-01\] Reentrancy at \_requestLoan allows requesting a loan without supplying collateral](https://github.com/code-423n4/2022-04-abranft-findings/issues/61)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by kenzo, also found by WatchPug, GimelSec, Czar102, and AuditsAreUS_

[https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L218](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L218)

[https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L238](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPairWithOracle.sol#L238)

`_requestLoan` makes an external call to the collateral contract before updating the NFTPair contract state.

### [](#impact)Impact

If the ERC721 collateral has a afterTokenTransfer hook, The NFTPair contract can be reentered, and a loan can be requested without the borrower supplying the collateral. Someone can then lend for the loan while the collateral is missing from the contract. Therefore the malicious borrower received the loan without supplying collateral - so lender’s funds can be stolen. The issue is present in both NFTPair and NFTPairWithOracle.

### [](#proof-of-concept-5)Proof of Concept

Assume the NFT contract has an [afterTokenTransfer hook](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721-_afterTokenTransfer-address-address-uint256-) which calls back to the malicious borrower. POC in short: borrower will call `requestLoan` with `skim==false`, then during the hook will reenter `requestLoan` with `skim==true`, then call `removeCollateral` to get his collateral back, then the first `requestLoan` will resume and initiate the loan, although the collateral is not in the contract any more.

POC in long: the borrower will do the following:

*   Call [`requestLoan`](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L205:#L227) with skim==false.
*   `requestLoan` [will call](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L218) `collateral.transferFrom()`.
*   The collateral will be transferred to the NFTPair. Afterwards, the ERC721 contract will execute the `afterTokenTransfer` hook, and hand control back to Malbo (malicious borrower).
*   Malbo will call `requestLoan` again with `skim==true`.
*   As the first request’s details have not been updated yet, the tokenId status is still LOAN\_INITIAL, and the [require statement of the loan status](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L214) will pass.
*   The NFT has already been transfered to the contract, so the [require statement of token ownership](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L216) will pass.
*   `requestLoan` (the second) will continue and set the loan details and status.
*   After it finishes, still within the `afterTokenTransfer` hook, Malbo will call [`removeCollateral`](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L247:#L268). His call will succeed as the loan is in status requested. So the collateral will get sent back to Malbo.
*   Now the `afterTokenTransfer` hook finishes.
*   The original `requestLoan` will resume operation at the [point](https://github.com/code-423n4/2022-04-abranft/blob/main/contracts/NFTPair.sol#L220:#L224) where all the loan details will be updated.
*   Therefore, the contract will mark the loan is valid, although the collateral is not in the contract anymore. A lender might then lend funds against the loan without Malbo needing to pay back.

### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

Move the external call to the end of the function to conform with checks-effects-interaction pattern.

**[cryptolyndon (AbraNFT) disputed and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/61#issuecomment-1118148144):**

> Not a bug. We do not use `safeTransfer`, and if the collateral contract cannot be trusted, then all bets are off.

**[0xean (judge) downgraded to medium severity and commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/61#issuecomment-1133436020):**

> I am downgrading this to medium severity and do believe it should be fixed by the sponsor. Re-entrancy has proved to be a problem in many ways in the space and while the sponsor says they are trusting the collateral contract, I dont think this is a defensible stance from what can be easily mitigated by either re-ordering code to conform to well established patterns or by adding a modifier.
> 
> `2 — Med: Assets not at direct risk, but the function of the protocol or its availability could be impacted, or leak value with a hypothetical attack path with stated assumptions, but external requirements.`

* * *

[](#low-risk-and-non-critical-issues)Low Risk and Non-Critical Issues
=====================================================================

For this contest, 45 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-04-abranft-findings/issues/75) by **IllIllI** received the top score from the judge.

_The following wardens also submitted reports: [horsefacts](https://github.com/code-423n4/2022-04-abranft-findings/issues/168), [bobi](https://github.com/code-423n4/2022-04-abranft-findings/issues/66), [berndartmueller](https://github.com/code-423n4/2022-04-abranft-findings/issues/128), [reassor](https://github.com/code-423n4/2022-04-abranft-findings/issues/95), [joestakey](https://github.com/code-423n4/2022-04-abranft-findings/issues/107), [hyh](https://github.com/code-423n4/2022-04-abranft-findings/issues/180), [MaratCerby](https://github.com/code-423n4/2022-04-abranft-findings/issues/42), [defsec](https://github.com/code-423n4/2022-04-abranft-findings/issues/165), [pauliax](https://github.com/code-423n4/2022-04-abranft-findings/issues/178), [z3s](https://github.com/code-423n4/2022-04-abranft-findings/issues/161), [simon135](https://github.com/code-423n4/2022-04-abranft-findings/issues/143), [CertoraInc](https://github.com/code-423n4/2022-04-abranft-findings/issues/81), [delfin454000](https://github.com/code-423n4/2022-04-abranft-findings/issues/134), [0xf15ers](https://github.com/code-423n4/2022-04-abranft-findings/issues/77), [BowTiedWardens](https://github.com/code-423n4/2022-04-abranft-findings/issues/137), [kenzo](https://github.com/code-423n4/2022-04-abranft-findings/issues/172), [Funen](https://github.com/code-423n4/2022-04-abranft-findings/issues/159), [antonttc](https://github.com/code-423n4/2022-04-abranft-findings/issues/195), [bobirichman](https://github.com/code-423n4/2022-04-abranft-findings/issues/121), [sikorico](https://github.com/code-423n4/2022-04-abranft-findings/issues/123), [samruna](https://github.com/code-423n4/2022-04-abranft-findings/issues/12), [catchup](https://github.com/code-423n4/2022-04-abranft-findings/issues/59), [oyc\_109](https://github.com/code-423n4/2022-04-abranft-findings/issues/15), [m9800](https://github.com/code-423n4/2022-04-abranft-findings/issues/193), [gzeon](https://github.com/code-423n4/2022-04-abranft-findings/issues/149), [ilan](https://github.com/code-423n4/2022-04-abranft-findings/issues/109), [GimelSec](https://github.com/code-423n4/2022-04-abranft-findings/issues/119), [AuditsAreUS](https://github.com/code-423n4/2022-04-abranft-findings/issues/192), [broccolirob](https://github.com/code-423n4/2022-04-abranft-findings/issues/199), [cccz](https://github.com/code-423n4/2022-04-abranft-findings/issues/20), [kenta](https://github.com/code-423n4/2022-04-abranft-findings/issues/197), [unforgiven](https://github.com/code-423n4/2022-04-abranft-findings/issues/45), [robee](https://github.com/code-423n4/2022-04-abranft-findings/issues/124), [0x1337](https://github.com/code-423n4/2022-04-abranft-findings/issues/41), [gs8nrv](https://github.com/code-423n4/2022-04-abranft-findings/issues/135), [jah](https://github.com/code-423n4/2022-04-abranft-findings/issues/83), [0x1f8b](https://github.com/code-423n4/2022-04-abranft-findings/issues/30), [hubble](https://github.com/code-423n4/2022-04-abranft-findings/issues/101), [kebabsec](https://github.com/code-423n4/2022-04-abranft-findings/issues/85), [WatchPug](https://github.com/code-423n4/2022-04-abranft-findings/issues/88), [throttle](https://github.com/code-423n4/2022-04-abranft-findings/issues/84), [mics](https://github.com/code-423n4/2022-04-abranft-findings/issues/122), [Ruhum](https://github.com/code-423n4/2022-04-abranft-findings/issues/67), and [0xDjango](https://github.com/code-423n4/2022-04-abranft-findings/issues/91)._

[](#l-01-should-ensure-loan-collateral-is-not-immediately-seizable)\[L-01\] Should ensure loan collateral is not immediately seizable
-------------------------------------------------------------------------------------------------------------------------------------

For the Oracle version there are checks to make sure that the current valuation is above the amount loaned. There should be a similar check that the loan duration is not zero. Zero is not useful for flash loans because of the origination fees.

    File: contracts/NFTPairWithOracle.sol   #1
    
    224          tokenLoanParams[tokenId] = params;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L224](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L224)

    File: contracts/NFTPairWithOracle.sol   #2
    
    244          tokenLoanParams[tokenId] = params;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L244](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L244)

[](#l-02-pairs-do-not-implement-erc721tokenreceiver)\[L-02\] Pairs do not implement `ERC721TokenReceiver`
---------------------------------------------------------------------------------------------------------

According to the `README.md`, `NFTPair`s specifically involve `ERC721` tokens. Therefore the contract should implement `ERC721TokenReceiver`, or customer transfers involving `safeTransferFrom()` calls will revert

    File: contracts/NFTPair.sol   #1
    
    59  contract NFTPair is BoringOwnable, Domain, IMasterContract {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L59](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L59)

    File: contracts/NFTPairWithOracle.sol   #2
    
    69  contract NFTPairWithOracle is BoringOwnable, Domain, IMasterContract {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L69](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L69)

[](#l-03-incorrect-comments)\[L-03\] Incorrect comments
-------------------------------------------------------

Skimming involves excess balances in the _bentobox_, not in the contract itself. This comment will lead to clients incorrectly passing tokens to the pair, rather than the bentobox. In addition, overall, there should be more comments devited to the interactions with the bentobox

    File: contracts/NFTPair.sol   #1
    
    320      /// @param skim True if the funds have been transfered to the contract

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L320](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L320)

    File: contracts/NFTPairWithOracle.sol   #2
    
    355      /// @param skim True if the funds have been transfered to the contract

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L355](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L355)

[](#l-04-calls-incorrectly-allow-non-zero-msgvalue)\[L-04\] Calls incorrectly allow non-zero `msg.value`
--------------------------------------------------------------------------------------------------------

The comments below say that `msg.value` is “only applicable to” a subset of actions. All other actions should have a `require(!msg.value)`. Allowing it anyway is incorrect state handling

    File: contracts/NFTPair.sol   #1
    
    631      /// @param values A one-to-one mapped array to `actions`. ETH amounts to send along with the actions.
    632      /// Only applicable to `ACTION_CALL`, `ACTION_BENTO_DEPOSIT`.

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L631-L632](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L631-L632)

    File: contracts/NFTPairWithOracle.sol   #2
    
    664      /// @param values A one-to-one mapped array to `actions`. ETH amounts to send along with the actions.
    665      /// Only applicable to `ACTION_CALL`, `ACTION_BENTO_DEPOSIT`.

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L664-L665](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L664-L665)

[](#l-05-missing-checks-for-address0x0-when-assigning-values-to-address-state-variables)\[L-05\] Missing checks for `address(0x0)` when assigning values to `address` state variables
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    File: contracts/NFTPair.sol   #1
    
    729           feeTo = newFeeTo;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L729](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L729)

    File: contracts/NFTPairWithOracle.sol   #2
    
    751           feeTo = newFeeTo;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L751](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L751)

[](#l-06-ecrecover-not-checked-for-zero-result)\[L-06\] `ecrecover` not checked for zero result
-----------------------------------------------------------------------------------------------

A return value of zero indicates an invalid signature, so this is both invalid state-handling and an incorrect message

    File: contracts/NFTPair.sol   #1
    
    383              require(ecrecover(_getDigest(dataHash), v, r, s) == lender, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L383](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L383)

    File: contracts/NFTPair.sol   #2
    
    419          require(ecrecover(_getDigest(dataHash), v, r, s) == borrower, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L419](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L419)

    File: contracts/NFTPairWithOracle.sol   #3
    
    417              require(ecrecover(_getDigest(dataHash), signature.v, signature.r, signature.s) == lender, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L417](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L417)

    File: contracts/NFTPairWithOracle.sol   #4
    
    452          require(ecrecover(_getDigest(dataHash), signature.v, signature.r, signature.s) == borrower, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L452](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L452)

[](#n-01-consider-supporting-cryptopunks-and-etherrocks)\[N-01\] Consider supporting CryptoPunks and EtherRocks
---------------------------------------------------------------------------------------------------------------

The project `README.md` says that `NFTPair`s are specifically ERC721 tokens, but not all NFTs are ERC721s. CryptoPunks and EtherRocks came before the standard and do not conform to it.

    File: README.md   #1
    
    58  - NFT Pair are a version of Cauldrons where the collateral isn't an ERC20 token but an ERC721 token, the deal OTC, the parameters of the loan themselves pre-defined.

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/README.md?plain=1#L58](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/README.md?plain=1#L58)

[](#n-02-contracts-should-be-refactored-to-extend-a-base-contract-with-the-common-functionality)\[N-02\] Contracts should be refactored to extend a base contract with the common functionality
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    $ fgrep -xf NFTPair.sol NFTPairWithOracle.sol | wc -l
    686
    $ wc -l NFTPair.sol NFTPairWithOracle.sol
    732 NFTPair.sol
    754 NFTPairWithOracle.sol

    686 / 732 = 93.7%
    686 / 754 = 91.0%

About 92% of the lines in each file are exactly the same as the lines in the other file. At the very least the shared constants, the common state variables, and the pure functions should be moved to a common base contract.

    File: contracts/NFTPair.sol (various lines)   #1

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol)

    File: contracts/NFTPairWithOracle.sol (various lines)   #2

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol)

[](#n-03-some-compilers-cant-handle-two-different-contracts-with-the-same-name)\[N-03\] Some compilers can’t handle two different contracts with the same name
--------------------------------------------------------------------------------------------------------------------------------------------------------------

Some [compilers](https://github.com/trufflesuite/truffle/issues/2147) only compile the first one they encounter, ignoring the second one. If two contracts are different (e.g. different struct argument definitions) then they should have different names

    File: contracts/NFTPair.sol   #1
    
    37  interface ILendingClub {
    38      // Per token settings.
    39      function willLend(uint256 tokenId, TokenLoanParams memory params) external view returns (bool);
    40  
    41      function lendingConditions(address nftPair, uint256 tokenId) external view returns (TokenLoanParams memory);
    42  }

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L37-L42](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L37-L42)

    File: contracts/NFTPairWithOracle.sol   #2
    
    47  interface ILendingClub {
    48      // Per token settings.
    49      function willLend(uint256 tokenId, TokenLoanParams memory params) external view returns (bool);
    50  
    51      function lendingConditions(address nftPair, uint256 tokenId) external view returns (TokenLoanParams memory);
    52  }

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L47-L52](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L47-L52)

[](#n-04-calls-to-boringmathto128-are-redundant)\[N-04\] Calls to `BoringMath.to128()` are redundant
----------------------------------------------------------------------------------------------------

All calls to `to128()` occur on the result of `calculateInterest()`, which itself already checks that the value fits into a `uint128`

    File: contracts/NFTPairWithOracle.sol   #1
    
    285                  ).to128();

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L285](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L285)

    File: contracts/NFTPairWithOracle.sol   #2
    
    552          uint256 interest = calculateInterest(principal, uint64(block.timestamp - loan.startTime), loanParams.annualInterestBPS).to128();

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L552](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L552)

    File: contracts/NFTPair.sol   #3
    
    519          uint256 interest = calculateInterest(principal, uint64(block.timestamp - loan.startTime), loanParams.annualInterestBPS).to128();

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L519](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L519)

[](#n-05-requirerevert-statements-should-have-descriptive-reason-strings)\[N-05\] `require()`/`revert()` statements should have descriptive reason strings
----------------------------------------------------------------------------------------------------------------------------------------------------------

    File: contracts/NFTPair.sol   #1
    
    501               revert();

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L501](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L501)

    File: contracts/NFTPairWithOracle.sol   #2
    
    534               revert();

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L534](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L534)

[](#n-06-public-functions-not-called-by-the-contract-should-be-declared-external-instead)\[N-06\] `public` functions not called by the contract should be declared `external` instead
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Contracts [are allowed](https://docs.soliditylang.org/en/latest/contracts.html#function-overriding) to override their parents’ functions and change the visibility from `external` to `public`.

    File: contracts/NFTPair.sol   #1
    
    181       function updateLoanParams(uint256 tokenId, TokenLoanParams memory params) public {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L181](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L181)

    File: contracts/NFTPair.sol   #2
    
    713       function withdrawFees() public {
    714           address to = masterContract.feeTo();

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L713-L714](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L713-L714)

    File: contracts/NFTPair.sol   #3
    
    728       function setFeeTo(address newFeeTo) public onlyOwner {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L728](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L728)

    File: contracts/NFTPairWithOracle.sol   #4
    
    198       function updateLoanParams(uint256 tokenId, TokenLoanParams memory params) public {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L198](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L198)

    File: contracts/NFTPairWithOracle.sol   #5
    
    735       function withdrawFees() public {
    736           address to = masterContract.feeTo();

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L735-L736](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L735-L736)

    File: contracts/NFTPairWithOracle.sol   #6
    
    750       function setFeeTo(address newFeeTo) public onlyOwner {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L750](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L750)

[](#n-07-interfaces-should-be-moved-to-separate-files)\[N-07\] Interfaces should be moved to separate files
-----------------------------------------------------------------------------------------------------------

Most of the other interfaces in this project are in their own file in the interfaces directory. The interfaces below do not follow this pattern

    File: contracts/NFTPairWithOracle.sol   #1
    
    47  interface ILendingClub {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L47](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L47)

    File: contracts/NFTPairWithOracle.sol   #2
    
    54  interface INFTPair {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L54](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L54)

    File: contracts/NFTPair.sol   #3
    
    37  interface ILendingClub {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L37](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L37)

    File: contracts/NFTPair.sol   #4
    
    44  interface INFTPair {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L44](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L44)

[](#n-08-2n---1-should-be-re-written-as-typeuintnmax)\[N-08\] `2**<n> - 1` should be re-written as `type(uint<n>).max`
----------------------------------------------------------------------------------------------------------------------

Earlier versions of solidity can use `uint<n>(-1)` instead. Expressions not including the `- 1` can often be re-written to accomodate the change (e.g. by using a `>` rather than a `>=`, which will also save some gas)

    File: contracts/NFTPair.sol   #1
    
    500           if (interest >= 2**128) {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L500](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L500)

    File: contracts/NFTPairWithOracle.sol   #2
    
    533           if (interest >= 2**128) {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L533](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L533)

[](#n-09-constants-should-be-defined-rather-than-using-magic-numbers)\[N-09\] `constant`s should be defined rather than using magic numbers
-------------------------------------------------------------------------------------------------------------------------------------------

    File: contracts/NFTPair.sol   #1
    
    500           if (interest >= 2**128) {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L500](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L500)

    File: contracts/NFTPairWithOracle.sol   #2
    
    533           if (interest >= 2**128) {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L533](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L533)

[](#n-10-numeric-values-having-to-do-with-time-should-use-time-units-for-readability)\[N-10\] Numeric values having to do with time should use time units for readability
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

There are [units](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#time-units) for seconds, minutes, hours, days, and weeks

    File: contracts/NFTPair.sol   #1
    
    111       uint256 private constant YEAR_BPS = 3600 * 24 * 365 * 10_000;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L111](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L111)

    File: contracts/NFTPairWithOracle.sol   #2
    
    128       uint256 private constant YEAR_BPS = 3600 * 24 * 365 * 10_000;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L128](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L128)

[](#n-11-use-a-more-recent-version-of-solidity)\[N-11\] Use a more recent version of solidity
---------------------------------------------------------------------------------------------

Use a solidity version of at least 0.8.4 to get `bytes.concat()` instead of `abi.encodePacked(<bytes>,<bytes>)` Use a solidity version of at least 0.8.12 to get `string.concat()` instead of `abi.encodePacked(<str>,<str>)`

    File: contracts/NFTPair.sol   #1
    
    20   pragma solidity 0.6.12;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L20](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L20)

    File: contracts/NFTPairWithOracle.sol   #2
    
    20   pragma solidity 0.6.12;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L20](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L20)

[](#n-12-constant-redefined-elsewhere)\[N-12\] Constant redefined elsewhere
---------------------------------------------------------------------------

Consider defining in only one contract so that values cannot become out of sync when only one location is updated. A [cheap way](https://medium.com/coinmonks/gas-cost-of-solidity-library-functions-dbe0cedd4678) to store constants in a single location is to create an `internal constant` in a `library`. If the variable is a local cache of another contract’s value, consider making the cache variable internal or private, which will require external users to query the contract with the source of truth, so that callers don’t get out of sync.

    File: contracts/NFTPairWithOracle.sol   #1
    
    93       IBentoBoxV1 public immutable bentoBox;

seen in contracts/NFTPair.sol [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L93](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L93)

    File: contracts/NFTPairWithOracle.sol   #2
    
    94       NFTPairWithOracle public immutable masterContract;

seen in contracts/NFTPair.sol [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L94](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L94)

[](#n-13-fee-mechanics-should-be-better-described)\[N-13\] Fee mechanics should be better described
---------------------------------------------------------------------------------------------------

When reading through the code the first time, it wasn’t clear exactly what `openFeeShare` was for and why it’s being subtracted from `totalShare`. Add to this the fact that the `protocolFee` is based on the `openFeeShare` and it seems like this area needs more comments, specifically that `openFeeShare` is the fee paid to the lender by the borrower during loan initiation, for the privilege of being given a loan.

    File: contracts/NFTPair.sol   #1
    
    295          if (skim) {
    296              require(
    297                  bentoBox.balanceOf(asset, address(this)) >= (totalShare - openFeeShare + protocolFeeShare + feesEarnedShare),
    298                  "NFTPair: skim too much"
    299              );
    300          } else {
    301              bentoBox.transfer(asset, lender, address(this), totalShare - openFeeShare + protocolFeeShare);
    302          }

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L295-L302](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L295-L302)

    File: contracts/NFTPairWithOracle.sol   #2
    
    330          if (skim) {
    331              require(
    332                  bentoBox.balanceOf(asset, address(this)) >= (totalShare - openFeeShare + protocolFeeShare + feesEarnedShare),
    333                  "NFTPair: skim too much"
    334              );
    335          } else {
    336              bentoBox.transfer(asset, lender, address(this), totalShare - openFeeShare + protocolFeeShare);
    337          }

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L330-L337](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L330-L337)

[](#n-14-typos)\[N-14\] Typos
-----------------------------

    File: contracts/NFTPair.sol   #1
    
    90       // Track assets we own. Used to allow skimming the excesss.

excesss [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L90](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L90)

    File: contracts/NFTPair.sol   #2
    
    114       // `calculateIntest`.

calculateIntest [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L114](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L114)

    File: contracts/NFTPair.sol   #3
    
    233       /// @param skim True if the token has already been transfered

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L233](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L233)

    File: contracts/NFTPair.sol   #4
    
    320       /// @param skim True if the funds have been transfered to the contract

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L320](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L320)

    File: contracts/NFTPair.sol   #5
    
    351       /// @param skimCollateral True if the collateral has already been transfered

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L351](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L351)

    File: contracts/NFTPair.sol   #6
    
    389       /// @notice Take collateral from a pre-commited borrower and lend against it

commited [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389)

    File: contracts/NFTPair.sol   #7
    
    394       /// @param skimFunds True if the funds have been transfered to the contract

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L394](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L394)

    File: contracts/NFTPair.sol   #8
    
    434       /// of the above inquality) fits in 128 bits, then the function is

inquality [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L434](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L434)

    File: contracts/NFTPair.sol   #9
    
    446           // (NOTE: n is hardcoded as COMPOUND_INTEREST_TERMS)

hardcoded [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L446](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L446)

    File: contracts/NFTPairWithOracle.sol   #10
    
    107       // Track assets we own. Used to allow skimming the excesss.

excesss [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L107](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L107)

    File: contracts/NFTPairWithOracle.sol   #11
    
    131       // `calculateIntest`.

calculateIntest [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L131](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L131)

    File: contracts/NFTPairWithOracle.sol   #12
    
    253       /// @param skim True if the token has already been transfered

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L253](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L253)

    File: contracts/NFTPairWithOracle.sol   #13
    
    355       /// @param skim True if the funds have been transfered to the contract

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L355](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L355)

    File: contracts/NFTPairWithOracle.sol   #14
    
    386       /// @param skimCollateral True if the collateral has already been transfered

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L386](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L386)

    File: contracts/NFTPairWithOracle.sol   #15
    
    423       /// @notice Take collateral from a pre-commited borrower and lend against it

commited [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L423](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L423)

    File: contracts/NFTPairWithOracle.sol   #16
    
    428       /// @param skimFunds True if the funds have been transfered to the contract

transfered [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L428](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L428)

    File: contracts/NFTPairWithOracle.sol   #17
    
    467       /// of the above inquality) fits in 128 bits, then the function is

inquality [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L467](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L467)

    File: contracts/NFTPairWithOracle.sol   #18
    
    479           // (NOTE: n is hardcoded as COMPOUND_INTEREST_TERMS)

hardcoded [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L479](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L479)

[](#n-15-natspec-is-incomplete)\[N-15\] NatSpec is incomplete
-------------------------------------------------------------

    File: contracts/NFTPair.sol   #1
    
    346       /// @notice Caller provides collateral; loan can go to a different address.
    347       /// @param tokenId ID of the token that will function as collateral
    348       /// @param lender Lender, whose BentoBox balance the funds will come from
    349       /// @param recipient Address to receive the loan.
    350       /// @param params Loan parameters requested, and signed by the lender
    351       /// @param skimCollateral True if the collateral has already been transfered
    352       /// @param anyTokenId Set if lender agreed to any token. Must have tokenId 0 in signature.
    353       function requestAndBorrow(
    354           uint256 tokenId,
    355           address lender,
    356           address recipient,
    357           TokenLoanParams memory params,
    358           bool skimCollateral,
    359           bool anyTokenId,
    360           uint256 deadline,
    361           uint8 v,
    362           bytes32 r,
    363           bytes32 s

Missing: `@param deadline` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363)

    File: contracts/NFTPair.sol   #2
    
    346       /// @notice Caller provides collateral; loan can go to a different address.
    347       /// @param tokenId ID of the token that will function as collateral
    348       /// @param lender Lender, whose BentoBox balance the funds will come from
    349       /// @param recipient Address to receive the loan.
    350       /// @param params Loan parameters requested, and signed by the lender
    351       /// @param skimCollateral True if the collateral has already been transfered
    352       /// @param anyTokenId Set if lender agreed to any token. Must have tokenId 0 in signature.
    353       function requestAndBorrow(
    354           uint256 tokenId,
    355           address lender,
    356           address recipient,
    357           TokenLoanParams memory params,
    358           bool skimCollateral,
    359           bool anyTokenId,
    360           uint256 deadline,
    361           uint8 v,
    362           bytes32 r,
    363           bytes32 s

Missing: `@param v` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363)

    File: contracts/NFTPair.sol   #3
    
    346       /// @notice Caller provides collateral; loan can go to a different address.
    347       /// @param tokenId ID of the token that will function as collateral
    348       /// @param lender Lender, whose BentoBox balance the funds will come from
    349       /// @param recipient Address to receive the loan.
    350       /// @param params Loan parameters requested, and signed by the lender
    351       /// @param skimCollateral True if the collateral has already been transfered
    352       /// @param anyTokenId Set if lender agreed to any token. Must have tokenId 0 in signature.
    353       function requestAndBorrow(
    354           uint256 tokenId,
    355           address lender,
    356           address recipient,
    357           TokenLoanParams memory params,
    358           bool skimCollateral,
    359           bool anyTokenId,
    360           uint256 deadline,
    361           uint8 v,
    362           bytes32 r,
    363           bytes32 s

Missing: `@param r` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363)

    File: contracts/NFTPair.sol   #4
    
    346       /// @notice Caller provides collateral; loan can go to a different address.
    347       /// @param tokenId ID of the token that will function as collateral
    348       /// @param lender Lender, whose BentoBox balance the funds will come from
    349       /// @param recipient Address to receive the loan.
    350       /// @param params Loan parameters requested, and signed by the lender
    351       /// @param skimCollateral True if the collateral has already been transfered
    352       /// @param anyTokenId Set if lender agreed to any token. Must have tokenId 0 in signature.
    353       function requestAndBorrow(
    354           uint256 tokenId,
    355           address lender,
    356           address recipient,
    357           TokenLoanParams memory params,
    358           bool skimCollateral,
    359           bool anyTokenId,
    360           uint256 deadline,
    361           uint8 v,
    362           bytes32 r,
    363           bytes32 s

Missing: `@param s` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L346-L363)

    File: contracts/NFTPair.sol   #5
    
    389       /// @notice Take collateral from a pre-commited borrower and lend against it
    390       /// @notice Collateral must come from the borrower, not a third party.
    391       /// @param tokenId ID of the token that will function as collateral
    392       /// @param borrower Address that provides collateral and receives the loan
    393       /// @param params Loan terms offered, and signed by the borrower
    394       /// @param skimFunds True if the funds have been transfered to the contract
    395       function takeCollateralAndLend(
    396           uint256 tokenId,
    397           address borrower,
    398           TokenLoanParams memory params,
    399           bool skimFunds,
    400           uint256 deadline,
    401           uint8 v,
    402           bytes32 r,
    403           bytes32 s

Missing: `@param deadline` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403)

    File: contracts/NFTPair.sol   #6
    
    389       /// @notice Take collateral from a pre-commited borrower and lend against it
    390       /// @notice Collateral must come from the borrower, not a third party.
    391       /// @param tokenId ID of the token that will function as collateral
    392       /// @param borrower Address that provides collateral and receives the loan
    393       /// @param params Loan terms offered, and signed by the borrower
    394       /// @param skimFunds True if the funds have been transfered to the contract
    395       function takeCollateralAndLend(
    396           uint256 tokenId,
    397           address borrower,
    398           TokenLoanParams memory params,
    399           bool skimFunds,
    400           uint256 deadline,
    401           uint8 v,
    402           bytes32 r,
    403           bytes32 s

Missing: `@param v` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403)

    File: contracts/NFTPair.sol   #7
    
    389       /// @notice Take collateral from a pre-commited borrower and lend against it
    390       /// @notice Collateral must come from the borrower, not a third party.
    391       /// @param tokenId ID of the token that will function as collateral
    392       /// @param borrower Address that provides collateral and receives the loan
    393       /// @param params Loan terms offered, and signed by the borrower
    394       /// @param skimFunds True if the funds have been transfered to the contract
    395       function takeCollateralAndLend(
    396           uint256 tokenId,
    397           address borrower,
    398           TokenLoanParams memory params,
    399           bool skimFunds,
    400           uint256 deadline,
    401           uint8 v,
    402           bytes32 r,
    403           bytes32 s

Missing: `@param r` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403)

    File: contracts/NFTPair.sol   #8
    
    389       /// @notice Take collateral from a pre-commited borrower and lend against it
    390       /// @notice Collateral must come from the borrower, not a third party.
    391       /// @param tokenId ID of the token that will function as collateral
    392       /// @param borrower Address that provides collateral and receives the loan
    393       /// @param params Loan terms offered, and signed by the borrower
    394       /// @param skimFunds True if the funds have been transfered to the contract
    395       function takeCollateralAndLend(
    396           uint256 tokenId,
    397           address borrower,
    398           TokenLoanParams memory params,
    399           bool skimFunds,
    400           uint256 deadline,
    401           uint8 v,
    402           bytes32 r,
    403           bytes32 s

Missing: `@param s` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L389-L403)

    File: contracts/NFTPairWithOracle.sol   #9
    
    381       /// @notice Caller provides collateral; loan can go to a different address.
    382       /// @param tokenId ID of the token that will function as collateral
    383       /// @param lender Lender, whose BentoBox balance the funds will come from
    384       /// @param recipient Address to receive the loan.
    385       /// @param params Loan parameters requested, and signed by the lender
    386       /// @param skimCollateral True if the collateral has already been transfered
    387       /// @param anyTokenId Set if lender agreed to any token. Must have tokenId 0 in signature.
    388       function requestAndBorrow(
    389           uint256 tokenId,
    390           address lender,
    391           address recipient,
    392           TokenLoanParams memory params,
    393           bool skimCollateral,
    394           bool anyTokenId,
    395           SignatureParams memory signature

Missing: `@param signature` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L381-L395](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L381-L395)

    File: contracts/NFTPairWithOracle.sol   #10
    
    423       /// @notice Take collateral from a pre-commited borrower and lend against it
    424       /// @notice Collateral must come from the borrower, not a third party.
    425       /// @param tokenId ID of the token that will function as collateral
    426       /// @param borrower Address that provides collateral and receives the loan
    427       /// @param params Loan terms offered, and signed by the borrower
    428       /// @param skimFunds True if the funds have been transfered to the contract
    429       function takeCollateralAndLend(
    430           uint256 tokenId,
    431           address borrower,
    432           TokenLoanParams memory params,
    433           bool skimFunds,
    434           SignatureParams memory signature

Missing: `@param signature` [https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L423-L434](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L423-L434)

[](#n-16-event-is-missing-indexed-fields)\[N-16\] Event is missing `indexed` fields
-----------------------------------------------------------------------------------

Each `event` should use three `indexed` fields if there are three or more fields

    File: contracts/NFTPair.sol   #1
    
    65       event LogRequestLoan(address indexed borrower, uint256 indexed tokenId, uint128 valuation, uint64 duration, uint16 annualInterestBPS);

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L65](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L65)

    File: contracts/NFTPair.sol   #2
    
    66       event LogUpdateLoanParams(uint256 indexed tokenId, uint128 valuation, uint64 duration, uint16 annualInterestBPS);

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L66](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L66)

    File: contracts/NFTPair.sol   #3
    
    68       event LogRemoveCollateral(uint256 indexed tokenId, address recipient);

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L68](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L68)

    File: contracts/NFTPair.sol   #4
    
    73       event LogWithdrawFees(address indexed feeTo, uint256 feeShare);

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L73](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L73)

    File: contracts/NFTPairWithOracle.sol   #5
    
    75       event LogRequestLoan(
    76           address indexed borrower,
    77           uint256 indexed tokenId,
    78           uint128 valuation,
    79           uint64 duration,
    80           uint16 annualInterestBPS,
    81           uint16 ltvBPS
    82       );

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L75-L82](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L75-L82)

    File: contracts/NFTPairWithOracle.sol   #6
    
    83       event LogUpdateLoanParams(uint256 indexed tokenId, uint128 valuation, uint64 duration, uint16 annualInterestBPS, uint16 ltvBPS);

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L83](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L83)

    File: contracts/NFTPairWithOracle.sol   #7
    
    85       event LogRemoveCollateral(uint256 indexed tokenId, address recipient);

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L85](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L85)

    File: contracts/NFTPairWithOracle.sol   #8
    
    90       event LogWithdrawFees(address indexed feeTo, uint256 feeShare);

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L90](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L90)

[](#n-17-a-best-practice-is-to-check-for-signature-malleability)\[N-17\] A best practice is to check for signature malleability
-------------------------------------------------------------------------------------------------------------------------------

    File: contracts/NFTPair.sol   #1
    
    383              require(ecrecover(_getDigest(dataHash), v, r, s) == lender, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L383](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L383)

    File: contracts/NFTPair.sol   #2
    
    419          require(ecrecover(_getDigest(dataHash), v, r, s) == borrower, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L419](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L419)

    File: contracts/NFTPairWithOracle.sol   #3
    
    417              require(ecrecover(_getDigest(dataHash), signature.v, signature.r, signature.s) == lender, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L417](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L417)

    File: contracts/NFTPairWithOracle.sol   #4
    
    452          require(ecrecover(_getDigest(dataHash), signature.v, signature.r, signature.s) == borrower, "NFTPair: signature invalid");

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L452](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L452)

[](#n-18-consider-making-contract-pausable-to-have-some-protection-against-ongoing-exploits)\[N-18\] Consider making contract `Pausable` to have some protection against ongoing exploits
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    File: contracts/NFTPair.sol   #1
    
    59  contract NFTPair is BoringOwnable, Domain, IMasterContract {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L59](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L59)

    File: contracts/NFTPairWithOracle.sol   #2
    
    69  contract NFTPairWithOracle is BoringOwnable, Domain, IMasterContract {

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L69](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L69)

[](#n-19-statesflags-should-use-enums-rather-than-separate-constants)\[N-19\] States/flags should use `Enum`s rather than separate constants
--------------------------------------------------------------------------------------------------------------------------------------------

    File: contracts/NFTPair.sol   #1
    
    96      uint8 private constant LOAN_INITIAL = 0;
    97      uint8 private constant LOAN_REQUESTED = 1;
    98      uint8 private constant LOAN_OUTSTANDING = 2;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L96-L98](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L96-L98)

    File: contracts/NFTPairWithOracle.sol   #2
    
    113      uint8 private constant LOAN_INITIAL = 0;
    114      uint8 private constant LOAN_REQUESTED = 1;
    115      uint8 private constant LOAN_OUTSTANDING = 2;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L113-L115](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L113-L115)

    File: contracts/NFTPair.sol   #3
    
    545      uint8 internal constant ACTION_REPAY = 2;
    546      uint8 internal constant ACTION_REMOVE_COLLATERAL = 4;
    547  
    548      uint8 internal constant ACTION_REQUEST_LOAN = 12;
    549      uint8 internal constant ACTION_LEND = 13;
    550  
    551      // Function on BentoBox
    552      uint8 internal constant ACTION_BENTO_DEPOSIT = 20;
    553      uint8 internal constant ACTION_BENTO_WITHDRAW = 21;
    554      uint8 internal constant ACTION_BENTO_TRANSFER = 22;
    555      uint8 internal constant ACTION_BENTO_TRANSFER_MULTIPLE = 23;
    556      uint8 internal constant ACTION_BENTO_SETAPPROVAL = 24;
    557  
    558      // Any external call (except to BentoBox)
    559      uint8 internal constant ACTION_CALL = 30;
    560  
    561      // Signed requests
    562      uint8 internal constant ACTION_REQUEST_AND_BORROW = 40;
    563      uint8 internal constant ACTION_TAKE_COLLATERAL_AND_LEND = 41;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L545-L563](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L545-L563)

    File: contracts/NFTPairWithOracle.sol   #4
    
    578      uint8 internal constant ACTION_REPAY = 2;
    579      uint8 internal constant ACTION_REMOVE_COLLATERAL = 4;
    580  
    581      uint8 internal constant ACTION_REQUEST_LOAN = 12;
    582      uint8 internal constant ACTION_LEND = 13;
    583  
    584      // Function on BentoBox
    585      uint8 internal constant ACTION_BENTO_DEPOSIT = 20;
    586      uint8 internal constant ACTION_BENTO_WITHDRAW = 21;
    587      uint8 internal constant ACTION_BENTO_TRANSFER = 22;
    588      uint8 internal constant ACTION_BENTO_TRANSFER_MULTIPLE = 23;
    589      uint8 internal constant ACTION_BENTO_SETAPPROVAL = 24;
    590  
    591      // Any external call (except to BentoBox)
    592      uint8 internal constant ACTION_CALL = 30;
    593  
    594      // Signed requests
    595      uint8 internal constant ACTION_REQUEST_AND_BORROW = 40;
    596      uint8 internal constant ACTION_TAKE_COLLATERAL_AND_LEND = 41;

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L578-L596](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L578-L596)

[](#n-20-non-exploitable-re-entrancies)\[N-20\] Non-exploitable re-entrancies
-----------------------------------------------------------------------------

Code should follow the best-practice of [check-effects-interaction](https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-11-coding-patterns/topic/checks-effects-interactions/)

See [original submission](https://github.com/code-423n4/2022-04-abranft-findings/issues/75) for details.

[](#n-21-comments-should-be-enforced-by-requires)\[N-21\] Comments should be enforced by `require()`s
-----------------------------------------------------------------------------------------------------

The comments below should be enforced by `require(block.timestamp < uint64(-1))`

    File: contracts/NFTPair.sol   #1
    
    311          loan.startTime = uint64(block.timestamp); // Do not use in 12e10 years..

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L311](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPair.sol#L311)

    File: contracts/NFTPairWithOracle.sol   #2
    
    346          loan.startTime = uint64(block.timestamp); // Do not use in 12e10 years..

[https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L346](https://github.com/code-423n4/2022-04-abranft/blob/5cd4edc3298c05748e952f8a8c93e42f930a78c2/contracts/NFTPairWithOracle.sol#L346)

**[cryptolyndon (AbraNFT) commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/75#issuecomment-1124529466):**

> **Low-risk issues:**
> 
> **\[L-03\]** Agreed; this does suggest ERC-20 transfers.
> 
> **\[L-04\]** Simply requiring msg.value to be zero would break things when some, but not all, actions use it.
> 
> **\[L-05\]** The zero address is pretty much the ONLY wrong address we could enter where actual loss of funds is not possible.

> **Non-critical issues:**
> 
> **\[N-01\]** Nonstandard NFT types that are popular enough to use warrant their own contract type.
> 
> **\[N-03\]** This is not some example project intended to be forked and used with a wide range of different compiler setups.
> 
> **\[N-11\]** As time ticks on 0.8.x becomes increasingly safe to use, but the suggested reason here does not even apply to our contract.
> 
> **\[N-12\]** `bentoBox` is not a constant that will necessarily be invariable across different master contracts. Clones already work as suggested.
> 
> **\[N-13\]** The contract is not meant to serve as sole documentation of our fee schedule.
> 
> **\[N-17\]** We use nonces to prevent replay attacks, rather than storing used signatures. A different, equally valid, signature of the same data would be of no use to an attacker.
> 
> **\[N-21\]** If you think this is going to be an issue, then think of all the gas wasted until then by even that single check! Time enough to write a V2.

**[0xean (judge) commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/75#issuecomment-1133671875):**

> I believe this to be the most complete QA report.

* * *

[](#gas-optimizations)Gas Optimizations
=======================================

For this contest, 33 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-04-abranft-findings/issues/126) by **BowTiedWardens** received the top score from the judge.

_The following wardens also submitted reports: [joestakey](https://github.com/code-423n4/2022-04-abranft-findings/issues/110), [horsefacts](https://github.com/code-423n4/2022-04-abranft-findings/issues/169), [IllIllI](https://github.com/code-423n4/2022-04-abranft-findings/issues/74), [0xkatana](https://github.com/code-423n4/2022-04-abranft-findings/issues/111), [robee](https://github.com/code-423n4/2022-04-abranft-findings/issues/125), [defsec](https://github.com/code-423n4/2022-04-abranft-findings/issues/167), [oyc\_109](https://github.com/code-423n4/2022-04-abranft-findings/issues/5), [reassor](https://github.com/code-423n4/2022-04-abranft-findings/issues/100), [Tomio](https://github.com/code-423n4/2022-04-abranft-findings/issues/40), [z3s](https://github.com/code-423n4/2022-04-abranft-findings/issues/160), [slywaters](https://github.com/code-423n4/2022-04-abranft-findings/issues/11), [catchup](https://github.com/code-423n4/2022-04-abranft-findings/issues/60), [0xNazgul](https://github.com/code-423n4/2022-04-abranft-findings/issues/98), [delfin454000](https://github.com/code-423n4/2022-04-abranft-findings/issues/132), [Tadashi](https://github.com/code-423n4/2022-04-abranft-findings/issues/65), [NoamYakov](https://github.com/code-423n4/2022-04-abranft-findings/issues/8), [simon135](https://github.com/code-423n4/2022-04-abranft-findings/issues/142), [gzeon](https://github.com/code-423n4/2022-04-abranft-findings/issues/148), [Funen](https://github.com/code-423n4/2022-04-abranft-findings/issues/158), [sorrynotsorry](https://github.com/code-423n4/2022-04-abranft-findings/issues/103), [CertoraInc](https://github.com/code-423n4/2022-04-abranft-findings/issues/80), [pauliax](https://github.com/code-423n4/2022-04-abranft-findings/issues/179), [0xf15ers](https://github.com/code-423n4/2022-04-abranft-findings/issues/78), [antonttc](https://github.com/code-423n4/2022-04-abranft-findings/issues/182), [kenta](https://github.com/code-423n4/2022-04-abranft-findings/issues/196), [TrungOre](https://github.com/code-423n4/2022-04-abranft-findings/issues/99), [Kulk0](https://github.com/code-423n4/2022-04-abranft-findings/issues/173), [fatherOfBlocks](https://github.com/code-423n4/2022-04-abranft-findings/issues/13), [0x1f8b](https://github.com/code-423n4/2022-04-abranft-findings/issues/29), [samruna](https://github.com/code-423n4/2022-04-abranft-findings/issues/7), [GimelSec](https://github.com/code-423n4/2022-04-abranft-findings/issues/120), and [Hawkeye](https://github.com/code-423n4/2022-04-abranft-findings/issues/189)._

[](#table-of-contents)Table of Contents
---------------------------------------

See [original submission](https://github.com/code-423n4/2022-04-abranft-findings/issues/126).

[](#g-01-nftpairinit-and-nftpairwithoracleinit-storage-usage-optimization)\[G-01\] `NFTPair.init` and `NFTPairWithOracle.init`: Storage usage optimization
----------------------------------------------------------------------------------------------------------------------------------------------------------

I suggest replacing:

    175:     function init(bytes calldata data) public payable override {
    176:         require(address(collateral) == address(0), "NFTPair: already initialized");
    177:         (collateral, asset) = abi.decode(data, (IERC721, IERC20));
    178:         require(address(collateral) != address(0), "NFTPair: bad pair"); //@audit could save 1 SLOAD here + refund 2 SSTOREs on revert
    179:     }

with:

    function init(bytes calldata data) public payable override {
        require(address(collateral) == address(0), "NFTPair: already initialized");
        (address _collateral, address _asset) = abi.decode(data, (IERC721, IERC20));
        require(address(_collateral) != address(0), "NFTPair: bad pair");
        (collateral, asset) = (_collateral, _asset);
    }

Here, we’re saving 1 SLOAD at the cost of 2 MSTOREs and 3 MLOADs => around 85 gas. Furthermore, in case of revert, a lot more gas would be refunded, as the 2 SSTORE operations are done after the `require` statements.

[](#g-02-caching-storage-values-in-memory)\[G-02\] Caching storage values in memory
-----------------------------------------------------------------------------------

The code can be optimized by minimising the number of SLOADs. SLOADs are expensive (100 gas) compared to MLOADs/MSTOREs (3 gas). Here, storage values should get cached in memory (see the `@audit` tags for further details):

    contracts/NFTPair.sol:
      290:         uint256 totalShare = bentoBox.toShare(asset, params.valuation, false); //@audit gas: asset SLOAD 1
      297:                 bentoBox.balanceOf(asset, address(this)) >= (totalShare - openFeeShare + protocolFeeShare + feesEarnedShare),  //@audit gas: asset SLOAD 2
      301:             bentoBox.transfer(asset, lender, address(this), totalShare - openFeeShare + protocolFeeShare);  //@audit gas: asset SLOAD 2
      305:         bentoBox.transfer(asset, address(this), loan.borrower, borrowerShare);  //@audit gas: asset SLOAD 3
      523:         uint256 totalShare = bentoBox.toShare(asset, amount, false); //@audit gas: asset SLOAD 1
      524:         uint256 feeShare = bentoBox.toShare(asset, fee, false); //@audit gas: asset SLOAD 2
      528:             require(bentoBox.balanceOf(asset, address(this)) >= (totalShare + feesEarnedShare), "NFTPair: skim too much");  //@audit gas: asset SLOAD 3
      532:             bentoBox.transfer(asset, msg.sender, address(this), feeShare); //@audit gas: asset SLOAD 3
      539:         bentoBox.transfer(asset, from, loan.lender, totalShare - feeShare); //@audit gas: asset SLOAD 4
    
    contracts/NFTPairWithOracle.sol:
      325:         uint256 totalShare = bentoBox.toShare(asset, params.valuation, false); //@audit gas: asset SLOAD 1
      332:                 bentoBox.balanceOf(asset, address(this)) >= (totalShare - openFeeShare + protocolFeeShare + feesEarnedShare), //@audit gas: asset SLOAD 2
      336:             bentoBox.transfer(asset, lender, address(this), totalShare - openFeeShare + protocolFeeShare); //@audit gas: asset SLOAD 2
      340:         bentoBox.transfer(asset, address(this), loan.borrower, borrowerShare); //@audit gas: asset SLOAD 3
      556:         uint256 totalShare = bentoBox.toShare(asset, amount, false); //@audit gas: asset SLOAD 1
      557:         uint256 feeShare = bentoBox.toShare(asset, fee, false); //@audit gas: asset SLOAD 2
      561:             require(bentoBox.balanceOf(asset, address(this)) >= (totalShare + feesEarnedShare), "NFTPair: skim too much"); //@audit gas: asset SLOAD 3
      565:             bentoBox.transfer(asset, msg.sender, address(this), feeShare); //@audit gas: asset SLOAD 3
      572:         bentoBox.transfer(asset, from, loan.lender, totalShare - feeShare); //@audit gas: asset SLOAD 4

[](#g-03-splitting-require-statements-that-use--saves-gas)\[G-03\] Splitting `require()` statements that use `&&` saves gas
---------------------------------------------------------------------------------------------------------------------------

Instead of using the `&&` operator in a single require statement to check multiple conditions, I suggest using multiple require statements with 1 condition per require statement (saving 3 gas per `&`):

    contracts/NFTPair.sol:
      622:         require(callee != address(bentoBox) && callee != address(collateral) && callee != address(this), "NFTPair: can't call");
    
    contracts/NFTPairWithOracle.sol:
      655:         require(callee != address(bentoBox) && callee != address(collateral) && callee != address(this), "NFTPair: can't call");

[](#g-04-an-arrays-length-should-be-cached-to-save-gas-in-for-loops)\[G-04\] An array’s length should be cached to save gas in for-loops
----------------------------------------------------------------------------------------------------------------------------------------

Reading array length at each iteration of the loop takes 6 gas (3 for mload and 3 to place memory\_offset) in the stack.

Caching the array length in the stack saves around 3 gas per iteration.

Here, I suggest storing the array’s length in a variable before the for-loop, and use it instead:

    NFTPair.sol:641:        for (uint256 i = 0; i < actions.length; i++) {
    NFTPairWithOracle.sol:674:        for (uint256 i = 0; i < actions.length; i++) {

[](#g-05-i-costs-less-gas-compared-to-i-or-i--1)\[G-05\] `++i` costs less gas compared to `i++` or `i += 1`
-----------------------------------------------------------------------------------------------------------

`++i` costs less gas compared to `i++` or `i += 1` for unsigned integer, as pre-increment is cheaper (about 5 gas per iteration). This statement is true even with the optimizer enabled.

`i++` increments `i` and returns the initial value of `i`. Which means:

    uint i = 1;  
    i++; // == 1 but i == 2  

But `++i` returns the actual incremented value:

    uint i = 1;  
    ++i; // == 2 and i == 2 too, so no need for a temporary variable  

In the first case, the compiler has to create a temporary variable (when used) for returning `1` instead of `2`

Instances include:

    NFTPair.sol:494:        for (uint256 k = 2; k <= COMPOUND_INTEREST_TERMS; k++) {
    NFTPair.sol:641:        for (uint256 i = 0; i < actions.length; i++) {
    NFTPairWithOracle.sol:527:        for (uint256 k = 2; k <= COMPOUND_INTEREST_TERMS; k++) {
    NFTPairWithOracle.sol:674:        for (uint256 i = 0; i < actions.length; i++) {

I suggest using `++i` instead of `i++` to increment the value of an uint variable.

[](#g-06-public-functions-to-external)\[G-06\] Public functions to external
---------------------------------------------------------------------------

The following functions could be set external to save gas and improve code quality.

        NFTPair.init(bytes) (contracts/NFTPair.sol#175-179)
        NFTPairWithOracle.init(bytes) (contracts/NFTPairWithOracle.sol#192-196)
        NFTPair.updateLoanParams(uint256,TokenLoanParams) (contracts/NFTPair.sol#181-203)
        NFTPair.withdrawFees() (contracts/NFTPair.sol#713-723)
        NFTPair.setFeeTo(address) (contracts/NFTPair.sol#728-731)
        NFTPairWithOracle.updateLoanParams(uint256,TokenLoanParams) (contracts/NFTPairWithOracle.sol#198-223)
        NFTPairWithOracle.withdrawFees() (contracts/NFTPairWithOracle.sol#735-745)
        NFTPairWithOracle.setFeeTo(address) (contracts/NFTPairWithOracle.sol#750-753)

[](#g-07-updateloanparams-replace-memory-with-calldata-and-public-with-external)\[G-07\] `updateLoanParams()`: Replace `memory` with `calldata` and `public` with `external`
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

This is valid in both files `NFTPair.sol` and `NFTPairWithOracle.sol`. As mentioned above, `updateLoanParams()` should be external. Furthermore, `TokenLoanParams memory params` should be `TokenLoanParams calldata params`. Therefore, we’d go from:

    function updateLoanParams(uint256 tokenId, TokenLoanParams memory params) public

to

    function updateLoanParams(uint256 tokenId, TokenLoanParams calldata params) external

[](#g-08-updateloanparams-copying-in-memory-can-be-more-expensive-than-using-the-storage-keyword)\[G-08\] `updateLoanParams()`: Copying in memory can be more expensive than using the `storage` keyword
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

This is valid in both files `NFTPair.sol` and `NFTPairWithOracle.sol`. In this particular case here, I suggest using the `storage` keyword instead of the `memory` one, as the copy in memory is wasting some MSTOREs and MLOADs. See the `@audit` tags for more details:

        function updateLoanParams(uint256 tokenId, TokenLoanParams memory params) public {
            TokenLoan memory loan = tokenLoan[tokenId]; //@audit gas: use the storage keyword instead and only cache loan.status
            if (loan.status == LOAN_OUTSTANDING) {
                // The lender can change terms so long as the changes are strictly
                // the same or better for the borrower:
                require(msg.sender == loan.lender, "NFTPair: not the lender");
                TokenLoanParams memory cur = tokenLoanParams[tokenId];  //@audit gas: copying in memory is actually more expensive in this use-case than using storage
                require(
                    params.duration >= cur.duration &&
                        params.valuation <= cur.valuation &&
                        params.annualInterestBPS <= cur.annualInterestBPS &&
                        params.ltvBPS <= cur.ltvBPS,
                    "NFTPair: worse params"
                );
            } else if (loan.status == LOAN_REQUESTED) {
                // The borrower has already deposited the collateral and can
                // change whatever they like
                require(msg.sender == loan.borrower, "NFTPair: not the borrower");
            } else {
              (...)

I suggest:

*   Using `TokenLoan storage loan = tokenLoan[tokenId];`
*   Only caching `loan.status` in memory as it can be evaluated twice (in the if/else statement)
*   Using `TokenLoanParams storage cur = tokenLoanParams[tokenId];`

[](#g-09-_lend-copying-in-memory-can-be-more-expensive-than-using-the-storage-keyword)\[G-09\] `_lend()`: Copying in memory can be more expensive than using the `storage` keyword
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

In this function, I suggest replacing `TokenLoan memory loan = tokenLoan[tokenId];` with `TokenLoan storage loan = tokenLoan[tokenId];`. Only 2 SLOADs are made (`loan.status` and `loan.borrower`) and the function is writing in memory (`loan` variable) before writing in storage. These steps are superfluous and there’s no value from a copy in memory here.

[](#g-10-no-need-to-explicitly-initialize-variables-with-default-values)\[G-10\] No need to explicitly initialize variables with default values
-----------------------------------------------------------------------------------------------------------------------------------------------

If a variable is not set/initialized, it is assumed to have the default value (`0` for `uint`, `false` for `bool`, `address(0)` for address…). Explicitly initializing it with its default value is an anti-pattern and wastes gas.

As an example: `for (uint256 i = 0; i < numIterations; ++i) {` should be replaced with `for (uint256 i; i < numIterations; ++i) {`

Instances include:

    NFTPair.sol:96:    uint8 private constant LOAN_INITIAL = 0;
    NFTPair.sol:641:        for (uint256 i = 0; i < actions.length; i++) {
    NFTPairWithOracle.sol:113:    uint8 private constant LOAN_INITIAL = 0;
    NFTPairWithOracle.sol:674:        for (uint256 i = 0; i < actions.length; i++) {

I suggest removing explicit initializations for default values.

[](#g-11-reduce-the-size-of-error-messages-long-revert-strings)\[G-11\] Reduce the size of error messages (Long revert Strings)
-------------------------------------------------------------------------------------------------------------------------------

Shortening revert strings to fit in 32 bytes will decrease deployment time gas and will decrease runtime gas when the revert condition is met.

Revert strings that are longer than 32 bytes require at least one additional mstore, along with additional overhead for computing memory offset, etc.

Revert strings > 32 bytes:

    NFTPair.sol:366:            require(ILendingClub(lender).willLend(tokenId, params), "NFTPair: LendingClub does not like you"); //@audit length == 38
    NFTPairWithOracle.sol:398:            require(ILendingClub(lender).willLend(tokenId, params), "NFTPair: LendingClub does not like you"); //@audit length == 38

I suggest shortening the revert strings to fit in 32 bytes, or using custom errors as described next.

**[cryptolyndon (AbraNFT) commented](https://github.com/code-423n4/2022-04-abranft-findings/issues/126#issuecomment-1126604522):**

> Good report, thank you. Detailed, specific to the actual contract / project, more in depth than the usual drive-by checklists.

* * *

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk14 { color: #F44747; } .dark-default-dark .mtk10 { color: #4EC9B0; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }