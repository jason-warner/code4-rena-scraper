![BadgerDAO](/static/8935a39f6cbc74d25107718ba8b8361c/4e333/Badger.jpg)

Badger Citadel contest  
Findings & Analysis Report
===================================================

#### 2022-04-22

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [Medium Risk Findings (3)](#medium-risk-findings-3)
    
    *   [\[M-01\] The Owner and Proxy Admin can make users lose funds (“rug vectors”)](#m-01-the-owner-and-proxy-admin-can-make-users-lose-funds-rug-vectors)
    *   [\[M-02\] `saleRecipient` can rug buyers](#m-02-salerecipient-can-rug-buyers)
    *   [\[M-03\] Owner can steal input tokens](#m-03-owner-can-steal-input-tokens)
*   [Low Risk and Non-Critical Issues](#low-risk-and-non-critical-issues)
    
    *   [Codebase Impressions and Summary](#codebase-impressions-and-summary)
    *   [L-01 Ambiguous usage of `^` operator](#l-01-ambiguous-usage-of--operator)
    *   [L-02 Owner can frontrun `buy` function](#l-02-owner-can-frontrun-buy-function)
    *   [N-01 Open TODO](#n-01-open-todo)
    *   [N-02 Inconsistent naming conventions](#n-02-inconsistent-naming-conventions)
*   [Gas Optimizations](#gas-optimizations)
    
    *   [G-01 Use `!= 0` rather than `> 0` for unsigned integers in `require()` statements](#g-01-use--0-rather-than--0-for-unsigned-integers-in-require-statements)
    *   [G-02 - Use local variables to cache results of storage reads](#g-02---use-local-variables-to-cache-results-of-storage-reads)
    *   [G-03 - Pre-calculate repeatedly-checked offsets](#g-03---pre-calculate-repeatedly-checked-offsets)
    *   [G-04 - Use `unchecked` for operations not expected to overflow](#g-04---use-unchecked-for-operations-not-expected-to-overflow)
    *   [G-05 - Pull tokens rather than pushing them](#g-05---pull-tokens-rather-than-pushing-them)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Badger Citadel smart contract system written in Solidity. The audit contest took place between February 4—February 6 2022.

[](#wardens)Wardens
-------------------

40 Wardens contributed reports to the Badger Citadel contest:

1.  Czar102
2.  gellej
3.  [cmichel](https://twitter.com/cmichelio)
4.  [pauliax](https://twitter.com/SolidityDev)
5.  [TomFrenchBlockchain](https://github.com/TomAFrench)
6.  [gzeon](https://twitter.com/gzeon)
7.  pedroais
8.  WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
9.  [tqts](https://tqts.ar/)
10.  0x1f8b
11.  [sirhashalot](https://twitter.com/SirH4shalot)
12.  hyh
13.  harleythedog
14.  [hickuphh3](https://twitter.com/HickupH)
15.  cccz
16.  hubble (ksk2345 and shri4net)
17.  [defsec](https://twitter.com/defsec_)
18.  [csanuragjain](https://twitter.com/csanuragjain)
19.  p4st13r4 ([0x69e8](https://github.com/0x69e8) and 0xb4bb4)
20.  0x0x0x
21.  IllIllI
22.  [Dravee](https://twitter.com/JustDravee)
23.  [OriDabush](https://twitter.com/ori_dabush)
24.  [Ruhum](https://twitter.com/0xruhum)
25.  NoamYakov
26.  robee
27.  floppydisk
28.  samruna
29.  [wuwe1](https://twitter.com/wuwe19)
30.  kenta
31.  peritoflores
32.  Jujic
33.  [rfa](https://www.instagram.com/riyan_rfa/)
34.  [PostMan56](https://twitter.com/Man56Post)
35.  [ych18](https://www.linkedin.com/in/yahia-chaabane/)
36.  [sabtikw](https://twitter.com/sabtikw)
37.  [throttle](https://twitter.com/Throt7le)

This contest was judged by [0xleastwood](https://twitter.com/liam_eastwood13).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

[](#summary)Summary
===================

The C4 analysis yielded 3 unique MEDIUM severity vulnerabilities. Additionally, the analysis included 24 reports detailing issues with a risk rating of LOW severity or non-critical as well as 22 reports recommending gas optimizations. All of the issues presented here are linked back to their original finding.

Notably, 0 vulnerabilities were found during this audit contest that received a risk rating in the category of HIGH severity.

[](#scope)Scope
===============

The code under review can be found within the [C4 Badger Citadel contest repository](https://github.com/code-423n4/2022-02-badger-citadel), and is composed of 1 smart contract written in the Solidity programming language and includes 384 lines of Solidity code.

[](#severity-criteria)Severity Criteria
=======================================

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

*   Malicious Input Handling
*   Escalation of privileges
*   Arithmetic
*   Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

[](#medium-risk-findings-3)Medium Risk Findings (3)
===================================================

[](#m-01-the-owner-and-proxy-admin-can-make-users-lose-funds-rug-vectors)[\[M-01\] The Owner and Proxy Admin can make users lose funds (“rug vectors”)](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/50)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gellej, also found by WatchPug, Czar102, csanuragjain, p4st13r4, pedroais, TomFrenchBlockchain, defsec, hubble, gzeon, 0x1f8b, and sirhashalot_

The contest explicitly asks to analyze the contract for “Rug Vectors”, so that is what this issue is about.

I have classified this issue as “high risk” - although the vulnerability is considerable, the attacks themselves are not very likely to occur (they depend on the owner and/or the proxy admin to be compromised). The main reason why I believe the vulnerabiity is “high” is because the very fact that all these factors exist can make the sale fail, as informed users will avoid the contract completely one they realize the extent in which the contract is manipulable.

In the current implementation, there several ways that investors can lose funds if the owner of the contract is not well behaved. These risks can be divided into two kinds:

*   owner becomes unable to act (for example, owner looses her private key, or the owner is a wallet or a DAO and signers cannot agree on the right action to take)
*   owner is malicious (for example, the owner account gets hacked or the signers turn bad), and wants to steal as much as the funds as possible (“Rug Vectors”), or executes a griefing attack (i.e. acts in such a way to hurt the buyers and/or the project, without immediate financial gain)

The contract is vulnerable to all three types of vulnerabilities (“rug pull”, “griefing” and “inactivity”).

(1) Loss of funds due to owner inactivity: (1a) If the owner does never funds the contract, the buyers will not receive their tokens, and have no recourse to get their investment back (1b) If the owner does not call `finalize`, buyers will not receive their tokens, and and have no recourse to get their investment back

(2) Griefing attacks by the owner (attacks that that have no immediate gain for the attacker, but are either annoying or lead to loss of funds) (2a) the owner can change many essential conditions of the sale: for example, the price, the start time, the duration, the guest list, and the total amount of tokens that are allowed to be sold. The owner can do this at any moment, also **while the sale is in course**. This allows for all kinds of griefing attacks. It also voids the whole point of using a smart contract in the first place. (2b) Owner can pause the contract at any time, which will freeze the funds in the contract, as it also disallows users to claim their tokens

(3) Rug pull by owner (attacks with financial gain for the attacker, buyer loses money) (3a) The Owner can call `sweep` at any time and remove all unsold CTDL tokens while the sale is in progress. Future buyers will still be able to buy tokens, but the sale can never be finalized (unless the owner funds the contract) (3b) Owner can front-run buyers and change the price. I.e. the owner can monitor the mem pool for a large `buy` transaction and precede the transaction with her own transaction that changes the price to a very low one. If the price is low enough, `getAmountOut` will return `0`, and the buyers will lose her funds and not receive any CTDL tokens at all.

(4) Rug pull by proxy Admin (4a) Although no deployment script is provided in the repo, we may assume (from the tests and the fact that the contracts are upgradeable) that the actual sale will be deployed as a proxy. The proxy admin (which may not be the same account as the owner) can change the implementation of the contract at any time, and in particular can change the implemention logic in such a way that all the funds held by the contract can be sent to the attacker.

### [](#recommended-mitigation-steps)Recommended Mitigation Steps

*   In general, I would recommend to not write your own contract at all, but instead use OpenZeppelin’s crowdsale contract: [https://docs.openzeppelin.com/contracts/2.x/api/crowdsale#Crowdsale](https://docs.openzeppelin.com/contracts/2.x/api/crowdsale#Crowdsale) which seems to fit your needs pretty well
*   To address 1a and 3a, enforce that the contract is funded with enough CTDL tokens _before_ the sale starts (for example, as part of the initialize logic)
*   To adress 1b, simply remove the “onlyOwner” modifier on the “finalize()” function so that it can be called by anyone
*   To (partially) address 2a, reduce the extent to which the owner can change the sale conditions during the sale (in any case remove the setSaleStart, setSaleEnd, setTokenInLimit or limit their application to before the sale starts). Ideally, once the sale starts, conditions of the sale remain unchanged, or change in a predictable way
*   To address 2b, leave the tokens of the buyer in the contract (instead of sending them to a `saleRecipient` and implement an `emergencyWithdraw` function that will work also when the contract is paused, and that allows buyers can use to retrieve their original investment in case something goes wrong
*   To address 3a, allow the owner to call `sweep` only after the sale is finalized
*   To address 3b, either do not allow to change the token price during the token sale, or, if you must have this functionality, have the price change take effect only after a delay to make front-running by the owner impossible
*   To address 4a, do not deploy the contract as a proxy at all (which seems overkill anyway, given the use case)

**[0xleastwood (judge) decreased to Medium severity and commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/50#issuecomment-1066631798):**

> Awesome write-up!
> 
> Because the issue outlined by the warden covers several separate issues from other wardens, I’ll mark this as the primary issue and de-duplicate all other issues.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/50#issuecomment-1069103297):**

> I’ve thought about this more and I’ve decided to split up distinct issues into 3 primary issues:
> 
> *   Owner rugs users.
> *   Funds are transferred to saleRecipient before settlement.
> *   Changing a token buy price during the sale by front-running buyers by forcing them to purchase at an unfair token price.
> 
> This issue falls under the first primary issue.

* * *

[](#m-02-salerecipient-can-rug-buyers)[\[M-02\] `saleRecipient` can rug buyers](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/61)
--------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug, also found by gellej, Czar102, hyh, harleythedog, pauliax, cmichel, 0x1f8b, hickuphh3, cccz, and sirhashalot_

In `TokenSaleUpgradeable.sol#buy()`, `tokenIn` will be transferred from the buyer directly to the `saleRecipient` without requiring/locking/releasing the corresponding amount of `tokenOut`.

This allows the `saleRecipient` to rug the users simply by not transferring `tokenOut` and finalizing the sale.

### [](#proof-of-concept)Proof of Concept

Given:

*   tokenIn: `WBTC`
*   \_tokenOutPrice: `1e8`
*   tokenOut: `CTDL`
*   Alice `buy()` with `100e8`;
*   Alice `buy()` with `200e8`;

A malicious `saleRecipient` can just not transfer any `CTDL` to the contract and `finalize()` and keep `300e8 WBTC` received.

As a result, Alice and Bob can not get the expected amount of `tokensOut`, and there is no way to retrieve the WBTC paid, in essence, lose all the funds.

### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

Instead of transferring the tokenIn directing to the `saleRecipient` in `buy()`, consider transferring the tokenIn into the contract (`address(this)`), and require a sufficient amount of `tokenOut` to be transferred into the contract first before the amount of `tokenIn` can be released to the `saleRecipient`.

**[shuklaayush (BadgerDAO) disagreed with severity](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/61)**

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/61#issuecomment-1066620627):**

> As this is also an issue regarding abuse of an owner’s admin privileges, it fits the criteria of a `medium` severity issue.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/61#issuecomment-1069067800):**

> I’ve thought about this more and I’ve decided to split up distinct issues into 3 primary issues:
> 
> *   Owner rugs users.
> *   Funds are transferred to `saleRecipient` before settlement.
> *   Changing a token buy price during the sale by front-running buyers by forcing them to purchase at an unfair token price.
> 
> This issue falls under the second primary issue.
> 
> *   Funds are transferred to `saleRecipient` before settlement.

* * *

[](#m-03-owner-can-steal-input-tokens)[\[M-03\] Owner can steal input tokens](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/105)
-------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by Czar102, also found by gellej, cmichel, tqts, gzeon, TomFrenchBlockchain, pauliax, and pedroais_

[TokenSaleUpgradeable.sol#L299-L309](https://github.com/code-423n4/2022-02-badger-citadel/blob/main/contracts/TokenSaleUpgradeable.sol#L299-L309)  
[TokenSaleUpgradeable.sol#L311-L324](https://github.com/code-423n4/2022-02-badger-citadel/blob/main/contracts/TokenSaleUpgradeable.sol#L311-L324)  
[TokenSaleUpgradeable.sol#L211-L224](https://github.com/code-423n4/2022-02-badger-citadel/blob/main/contracts/TokenSaleUpgradeable.sol#L211-L224)

Owner is in full control over the `saleRecipient` address. When a `buy()` transaction enters the mempool, an owner can frontrun the buy with a transaction that calls `setTokenOutPrice()` and sets the price to a very high value, effectively making bought tokens close to (if not usually equal) zero and consuming the tokens to the owner-selected address - `saleRecipient`. Thus, an owner has incentive to perform such attack as they may cause little or zero additional indebtnees to the contract and all tokens to the owner.

This can also be seen as a coincidence - an owner sets a price while a user broadcasts a `buy()` transaction. The user may buy for a significantly different price than they intended.

### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

Do not let changing sale price after the sale has started. Do not let changing sale start if the sale has already started.

**[GalloDaSballo (BadgerDAO) disagreed with severity and commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/105#issuecomment-1031666053):**

> I agree with the finding and the conclusion, we shouldn’t let the price change after the sale has started.
> 
> As for the example, that would only work once, because if we actually did that it would immediately warn every other user of our malicious behavior.
> 
> I think the finding is valid and it’s a clear example of admin privilege, so I believe medium severity to be more appropriate

**[0xleastwood (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/105#issuecomment-1066608561):**

> I agree with the sponsor on the above.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/105#issuecomment-1069077794):**

> I’ve thought about this more and I’ve decided to split up distinct issues into 3 primary issues:
> 
> *   Owner rugs users.
> *   Funds are transferred to saleRecipient before settlement.
> *   Changing a token buy price during the sale by front-running buyers by forcing them to purchase at an unfair token price.
> 
> I believe this satisfies the third primary issue description.
> 
> *   Changing a token buy price during the sale by front-running buyers by forcing them to purchase at an unfair token price.

* * *

[](#low-risk-and-non-critical-issues)Low Risk and Non-Critical Issues
=====================================================================

For this contest, 24 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/111) by warden **Czar102** received the top score from the judge.

_The following wardens also submitted reports: [0x0x0x](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/31), [gellej](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/51), [cmichel](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/40), [Dravee](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/106), [0x1f8b](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/18), [hubble](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/64), [OriDabush](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/69), [pauliax](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/96), [IllIllI](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/66), [sirhashalot](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/84), [NoamYakov](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/90), [tqts](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/28), [WatchPug](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/57), [hyh](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/107), [Ruhum](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/75), [floppydisk](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/34), [csanuragjain](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/23), [defsec](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/46), [gzeon](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/47), [samruna](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/1), [wuwe1](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/74), [robee](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/8), and [kenta](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/33)._

[](#codebase-impressions-and-summary)Codebase Impressions and Summary
---------------------------------------------------------------------

Several minor changes have been identified that can be applied in order to improve general security of the contract logic and code quality.

Among those, three out of four issues focus on code clarity, conventions and unambiguity of the comments. A possible attack vector has also been recognized, which makes the owner capable of griefing users and making their transactions revert, consuming gas fees.

[](#l-01-ambiguous-usage-of--operator)\[L-01\] Ambiguous usage of `^` operator
------------------------------------------------------------------------------

Is Solidity `^` is used for `xor` operation, but in [TokenSaleUpgradeable.sol:32](https://github.com/code-423n4/2022-02-badger-citadel/blob/84596551d62f243d13fcb2d486346dde08002f7b/contracts/TokenSaleUpgradeable.sol#L32) it is used to symbolize exponentiation. It is preferable to use `**` instead to avoid ambiguity or confusion.

    // TokenSaleUpgradeable.sol:32
    /// eg. 1 WBTC (8 decimals) = 40,000 CTDL ==> price = 10^8 / 40,000

[](#l-02-owner-can-frontrun-buy-function)\[L-02\] Owner can frontrun `buy` function
-----------------------------------------------------------------------------------

Owner can frontrun `buy` function in order to cause transaction to fail (and as a consequence make someone lose gas fee) by invoking one of these functions:

*   `setTokenInLimit`, with a small `_tokenInLimit` argument,
*   `setSaleDuration`, with a small `_saleDuration` argument,
*   `setSaleStart`, with a future timestamp.

### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

Revert calls to these functions after the sale has started.

[](#n-01-open-todo)\[N-01\] Open TODO
-------------------------------------

An open TODO is present in [TokenSaleUpgradeable.sol:13](https://github.com/code-423n4/2022-02-badger-citadel/blob/84596551d62f243d13fcb2d486346dde08002f7b/contracts/TokenSaleUpgradeable.sol#L13). It is recommended to avoid open TODOs as they may indicate programming errors that still need to be fixed.

    // TokenSaleUpgradeable.sol:13
    TODO: Better revert strings

[](#n-02-inconsistent-naming-conventions)\[N-02\] Inconsistent naming conventions
---------------------------------------------------------------------------------

The name of the variable `guestlist` (defined in [TokenSaleUpgradeable.sol:53](https://github.com/code-423n4/2022-02-badger-citadel/blob/84596551d62f243d13fcb2d486346dde08002f7b/contracts/TokenSaleUpgradeable.sol#L53)) and the event `GuestlistUpdated` (defined in [TokenSaleUpgradeable.sol:76](https://github.com/code-423n4/2022-02-badger-citadel/blob/84596551d62f243d13fcb2d486346dde08002f7b/contracts/TokenSaleUpgradeable.sol#L76)) should be changed to `guestList` and `GuestListUpdated` respectively in order to make them more readable and consistent with other parts of the code.

    // TokenSaleUpgradeable.sol:53
    BadgerGuestListAPI public guestlist;

    // TokenSaleUpgradeable.sol:76
    event GuestlistUpdated(address indexed guestlist);

**[GalloDaSballo (BadgerDao) commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/111#issuecomment-1031656506):**

> Appreciate the findings.
> 
> Pretty sure `^` in a comment gives same level of clarity
> 
> As for frontrun, I guess we could do that, but why?

* * *

[](#gas-optimizations)Gas Optimizations
=======================================

For this contest, 22 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/112) by warden **IllIllI** received the top score from the judge.

_The following wardens also submitted reports: [Czar102](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/108), [TomFrenchBlockchain](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/77), [Dravee](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/80), [WatchPug](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/56), [0x0x0x](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/32), [peritoflores](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/73), [hyh](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/110), [pauliax](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/97), [Ruhum](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/76), [Jujic](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/3), [rfa](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/79), [gzeon](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/48), [defsec](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/49), [tqts](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/29), [NoamYakov](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/35), [robee](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/7), [OriDabush](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/68), [PostMan56](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/9), [ych18](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/38), [sabtikw](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/19), and [throttle](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/21)._

[](#g-01-use--0-rather-than--0-for-unsigned-integers-in-require-statements)\[G-01\] Use `!= 0` rather than `> 0` for unsigned integers in `require()` statements
----------------------------------------------------------------------------------------------------------------------------------------------------------------

When the optimizer is enabled, gas is wasted by doing a greater-than operation, rather than a not-equals operation inside `require()` statements. When Using `!=`, the optimizer is able to avoid the `EQ`, `ISZERO`, and associated operations, by relying on the `JUMPI` that comes afterwards, which itself checks for zero.

### [](#examples)Examples

See markdown file within [original submission](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/112) for in-depth examples.

### [](#tools-used)Tools Used

Hardhat Forge npx @remix-project/remix-lib

### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

Use `!= 0` rather than `> 0` for unsigned integers in `require()` statements. Note that the comparison in `claim()` results in no gas savings.

[](#g-02---use-local-variables-to-cache-results-of-storage-reads)\[G-02\] - Use local variables to cache results of storage reads
---------------------------------------------------------------------------------------------------------------------------------

Reading from storage is expensive whereas reading from the stack is cheap. If the result of a storage read in required multiple times, the code should cache the value in a local variable, and read from that variable, rather than fetching from storage again.

### [](#examples-1)Examples

See markdown file within [original submission](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/112) for in-depth examples.

### [](#tools-used-1)Tools Used

Hardhat Forge npx @remix-project/remix-lib

### [](#recommended-mitigation-steps-5)Recommended Mitigation Steps

Cache the result of storage reads in a stack variable for future reads

[](#g-03---pre-calculate-repeatedly-checked-offsets)\[G-03\] - Pre-calculate repeatedly-checked offsets
-------------------------------------------------------------------------------------------------------

Reading from storage is expensive, so it saves gas when only one variable has to be read versus multiple. If there is a calculation which requires multiple storage reads, the calculation should be optimized to pre-calculate as much as possible, and store the intermediate result in storage.

### [](#examples-2)Examples

See markdown file within [original submission](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/112) for in-depth examples.

### [](#tools-used-2)Tools Used

Forge

### [](#recommended-mitigation-steps-6)Recommended Mitigation Steps

Pre-calculate the end timestamp, and reference that rather than adding `saleStart` and `saleDuration` in multiple places. Note that due to packing, the variable is sensitive to the order in which it is defined in the contract, as well as its visibility. Also note that while I’ve split the separate instances, in reality you’d apply both of them and get a larger ammortization benefit

[](#g-04---use-unchecked-for-operations-not-expected-to-overflow)\[G-04\] - Use `unchecked` for operations not expected to overflow
-----------------------------------------------------------------------------------------------------------------------------------

If it is not possible for an operation to overflow, it should be wrapped in `unchecked {}` to save the gas that would have been used to check for an overflow.

### [](#examples-3)Examples

See markdown file within [original submission](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/112) for in-depth examples.

### [](#tools-used-3)Tools Used

Hardhat Forge npx @remix-project/remix-lib

### [](#recommended-mitigation-steps-7)Recommended Mitigation Steps

Add `unchecked { }` and casts to operations that cannot overflow

[](#g-05---pull-tokens-rather-than-pushing-them)\[G-05\] - Pull tokens rather than pushing them
-----------------------------------------------------------------------------------------------

It wastes gas to push tokens to `saleRecipient` every time there is a buy.

### [](#examples-4)Examples

#### [](#1-tokensaleupgradeablesoll183)1\. [TokenSaleUpgradeable.sol:L183](https://github.com/code-423n4/2022-02-badger-citadel/blob/84596551d62f243d13fcb2d486346dde08002f7b/contracts/TokenSaleUpgradeable.sol#L183)

            tokenIn.safeTransferFrom(msg.sender, saleRecipient, _tokenInAmount);

### [](#recommended-mitigation-steps-8)Recommended Mitigation Steps

Create a new function or modify `sweep()` to send the current balance of the contract to `saleRecipient`

**[GalloDaSballo (BadgerDao) confirmed and commented](https://github.com/code-423n4/2022-02-badger-citadel-findings/issues/112#issuecomment-1045313951):**

> All findings are valid and appreciated, would recommend the warden to just post the specific gas differences instead of the whole table as there’s 10s of thousands of lines in the readme, but the only lines that count are very few.
> 
> That said, this may be the best report I’ve ever seen, as while it’s a lot of superfluous information (again just delete the redundant lines), the information is all there and verifiable.
> 
> I think the work from the warden is commendable and it is really appreciated.
> 
> A breath of fresh air compared to the usual copy paste “use != instead of >”

* * *

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }