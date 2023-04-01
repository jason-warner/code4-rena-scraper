![Float Capital](/static/8b6a492ddc6494fcd1c3e8597c0e6d12/4e333/float.jpg)

Float Capital contest  
Findings & Analysis Report
==================================================

#### 2021-09-16

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings](#high-risk-findings)
    
    *   [\[H-01\] copy paste error in `_batchConfirmOutstandingPendingActions`](#h-01-copy-paste-error-in-_batchconfirmoutstandingpendingactions)
    *   [\[H-02\] 2 variables not indexed by `marketIndex`](#h-02-2-variables-not-indexed-by-marketindex)
    *   [\[H-03\] Users could shift tokens on `Staker` with more than he has staked](#h-03-users-could-shift-tokens-on-staker-with-more-than-he-has-staked)
*   [Medium Risk Findings (6)](#medium-risk-findings-6)
    
    *   [\[M-01\] `latestMarket` used where `marketIndex` should have been used](#m-01-latestmarket-used-where-marketindex-should-have-been-used)
    *   [\[M-02\] Incorrect balance computed in `getUsersConfirmedButNotSettledSynthBalance()`](#m-02-incorrect-balance-computed-in-getusersconfirmedbutnotsettledsynthbalance)
    *   [\[M-03\] Missing events/timelocks for owner/admin only functions that change critical parameters](#m-03-missing-eventstimelocks-for-owneradmin-only-functions-that-change-critical-parameters)
    *   [\[M-04\] Staker.sol: Wrong values returned in edge cases of `_calculateFloatPerSecond()`](#m-04-stakersol-wrong-values-returned-in-edge-cases-of-_calculatefloatpersecond)
    *   [\[M-05\] Wrong aave usage of `claimRewards`](#m-05-wrong-aave-usage-of-claimrewards)
    *   [\[M-06\] Prevent markets getting stuck when prices don’t move](#m-06-prevent-markets-getting-stuck-when-prices-dont-move)
*   [Low Risk Findings (15)](#low-risk-findings-15)
    
    *   [\[L-01\] Missing input validation on many functions throughout the code](#l-01-missing-input-validation-on-many-functions-throughout-the-code)
    *   [\[L-02\] Comment-code mismatch for `_balanceIncentiveCurve_exponent` threshold](#l-02-comment-code-mismatch-for-_balanceincentivecurve_exponent-threshold)
    *   [\[L-03\] Use of floating pragma](#l-03-use-of-floating-pragma)
    *   [\[L-04\] prevent reentrancy](#l-04-prevent-reentrancy)
    *   [\[L-05\] `PERMANENT_INITIAL_LIQUIDITY_HOLDER` not 100% safe](#l-05-permanent_initial_liquidity_holder-not-100-safe)
    *   [\[L-06\] Staker.sol: Updating `kValue` requires interpolation with initial timestamp](#l-06-stakersol-updating-kvalue-requires-interpolation-with-initial-timestamp)
    *   [\[L-07\] TokenFactory.sol: DEFAULT_ADMIN_ROLE has wrong value](#l-07-tokenfactorysol-defaultadminrole-has-wrong-value-)
    *   [\[L-08\] `YieldManagerAave.sol`: Wrong branch in `depositPaymentToken()` if `amountReservedInCaseOfInsufficientAaveLiquidity` == amount](#l-08-yieldmanageraavesol-wrong-branch-in-depositpaymenttoken-if-amountreservedincaseofinsufficientaaveliquidity--amount)
    *   [\[L-09\] `LongShort` should not shares the same Yield Manager between different markets](#l-09-longshort-should-not-shares-the-same-yield-manager-between-different-markets)
    *   [\[L-10\] The address of Aave `lendingPool` may change](#l-10-the-address-of-aave-lendingpool-may-change)
    *   [\[L-11\] confusing comments](#l-11-confusing-comments)
    *   [\[L-12\] Docstring](#l-12-docstring)
    *   [\[L-13\] Possibly not all synths can be withdrawn](#l-13-possibly-not-all-synths-can-be-withdrawn)
    *   [\[L-14\] Protocol requires a running bot in order to make sure trades are actually executed](#l-14-protocol-requires-a-running-bot-in-order-to-make-sure-trades-are-actually-executed)
    *   [\[L-15\] Race-condition risk with initialize functions](#l-15-race-condition-risk-with-initialize-functions)
*   [Non-Critical Findings (25)](#non-critical-findings-25)
*   [Gas Optimizations (21)](#gas-optimizations-21)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code 432n4 (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Float Capital smart contract system written in Solidity. The code contest took place between August 4—August 11.

[](#wardens)Wardens
-------------------

16 Wardens contributed reports to the Float Capital code contest:

1.  [gpersoon](https://twitter.com/gpersoon)
2.  [shw](https://github.com/x9453)
3.  [hickuphh3](https://twitter.com/HickupH)
4.  [cmichel](https://twitter.com/cmichelio)
5.  [jonah1005](https://twitter.com/jonah1005w)
6.  [0xRajeev](https://twitter.com/0xRajeev)
7.  [pauliax](https://twitter.com/SolidityDev)
8.  [tensors](https://twitter.com/Tensors8)
9.  [hack3r-0m](https://twitter.com/hack3r_0m)
10.  [Jmukesh](https://twitter.com/MukeshJ_eth)
11.  [0xImpostor](https://twitter.com/0xImpostor)
12.  evertkors
13.  [loop](https://twitter.com/loop_225)
14.  [hrkrshnn](https://twitter.com/_hrkrshnn)
15.  [patitonar](https://twitter.com/patitonar)
16.  [bw](https://github.com/bernard-wagner)

This contest was judged by [0xean (judge)](https://github.com/0xean "judge").

Final report assembled by [moneylegobatman](https://twitter.com/money_lego) and [ninek](https://twitter.com/_ninek_).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 24 unique vulnerabilities. All of the issues presented here are linked back to their original finding

Of these vulnerabilities, 3 received a risk rating in the category of HIGH severity, 6 received a risk rating in the category of MEDIUM severity, and 15 received a risk rating in the category of LOW severity.

C4 analysis also identified 25 non-critical recommendations and 21 gas optimizations.

[](#scope)Scope
===============

The code under review can be found within the [C4 Float Capital code contest repository](https://github.com/code-423n4/2021-08-floatcapital) is comprised of 43 smart contracts written in the Solidity programming language and includes 4,215 lines of Solidity, 7,512 lines of ReasonMl, and 8,062 lines of Rescript code.

[](#severity-criteria)Severity Criteria
=======================================

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

*   Malicious Input Handling
*   Escalation of privileges
*   Arithmetic
*   Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

[](#high-risk-findings)High Risk Findings
=========================================

[](#h-01-copy-paste-error-in-_batchconfirmoutstandingpendingactions)[\[H-01\] copy paste error in `_batchConfirmOutstandingPendingActions`](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/5)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gpersoon, also found by cmichel and shw_

The function `_batchConfirmOutstandingPendingActions` of `LongShort.sol` processes the variable `batched_amountSyntheticToken_toShiftAwayFrom_marketSide`, and sets it to 0 after processing. However, probably due to a copy/paste error, in the second instance, where `batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][false]` is processed, the wrong version is set to 0: `batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][true]` = 0

This means the next time the `batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][false]` is processed again. As it is never reset, it keeps increasing. The result is that the internal administration will be off and far too many tokens will be shifted tokens from SHORT to LONG.

[`LongShort.sol` L1126](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/LongShort.sol#L1126)

    function _batchConfirmOutstandingPendingActions(
    ..
        amountForCurrentAction_workingVariable = batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][true];
        batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][true] = 0;
    ...
        amountForCurrentAction_workingVariable = batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][false];
        batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][true] = 0; // should probably be false
    )

Recommend changing the second instance of the following (on line 1207) `batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][true] = 0` to `batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][false] = 0`

p.s. confirmed by Jason of Floatcapital: “Yes, that should definitely be false!”

**[JasoonS (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/5#issuecomment-895969550):**

> Mitigation
> 
>     - batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][true] = 0
>     + batched_amountSyntheticToken_toShiftAwayFrom_marketSide[marketIndex][false] = 0

**[moose-code (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/5#issuecomment-896714257):**

> Good attention to detail. Silly on our part.

**[DenhamPreen (Float) patched](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/5#issuecomment-897472713):**

> [https://github.com/Float-Capital/monorepo/pull/1087](https://github.com/Float-Capital/monorepo/pull/1087)
> 
> Resolved PR
> 
> \*note this repo is still private

[](#h-02-2-variables-not-indexed-by-marketindex)[\[H-02\] 2 variables not indexed by `marketIndex`](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/8)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gpersoon_

In the token contract: `batched_stakerNextTokenShiftIndex` is indexed by `marketIndex`, so it can have separate (or the same) values for each different `marketIndex`.

`stakerTokenShiftIndex_to_longShortMarketPriceSnapshotIndex_mapping` and `stakerTokenShiftIndex_to_accumulativeFloatIssuanceSnapshotIndex_mapping` are not indexed by `marketIndex`. So the values of `stakerTokenShiftIndex_to_longShortMarketPriceSnapshotIndex_mapping` and `stakerTokenShiftIndex_to_accumulativeFloatIssuanceSnapshotIndex_mapping` can be overwritten by a different market, if `batched_stakerNextTokenShiftIndex[market1]`\==`batched_stakerNextTokenShiftIndex[market2]`

This will lead to weird results in`_calculateAccumulatedFloat`, allocating too much or too little float.

[`Staker.sol` L622](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/Staker.sol#L622)

    function pushUpdatedMarketPricesToUpdateFloatIssuanceCalculations(
        ...
          stakerTokenShiftIndex_to_longShortMarketPriceSnapshotIndex_mapping[ batched_stakerNextTokenShiftIndex[marketIndex]  ] = stakerTokenShiftIndex_to_longShortMarketPriceSnapshotIndex_mappingIfShiftExecuted;
          stakerTokenShiftIndex_to_accumulativeFloatIssuanceSnapshotIndex_mapping[  batched_stakerNextTokenShiftIndex[marketIndex]  ] = latestRewardIndex[marketIndex] + 1;
          batched_stakerNextTokenShiftIndex[marketIndex] += 1;
    ...
    )

Recommend adding an index with `marketIndex` to the variables:

*   `stakerTokenShiftIndex_to_longShortMarketPriceSnapshotIndex_mapping`
*   `stakerTokenShiftIndex_to_accumulativeFloatIssuanceSnapshotIndex_mapping`

Also consider shortening the variable names, this way mistakes can be spotted easier.

Confirmed by Jason of Float Capital: Yes, you are totally right, it should use the `marketIndex` since they are specific per market!

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/8#issuecomment-895999895):**

> ![emoji-see_no_evil](data:image/png;base64, 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 "emoji-see_no_evil") Embarrassed by this one!
> 
> Thank you for the report.
> 
> Fixed!!

[](#h-03-users-could-shift-tokens-on-staker-with-more-than-he-has-staked)[\[H-03\] Users could shift tokens on `Staker` with more than he has staked](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/141)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by shw_

The `shiftTokens` function of `Staker` checks whether the user has staked at least the number of tokens he wants to shift from one side to the other (line 885). A user could call the `shiftTokens` function multiple times before the next price update to shift the staker’s token from one side to the other with more than he has staked. [Staker.sol#L885](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/Staker.sol#L885)

Recommend adding checks on `userNextPrice_amountStakedSyntheticToken_toShiftAwayFrom_long` and `userNextPrice_amountStakedSyntheticToken_toShiftAwayFrom_short` to ensure that the sum of the two variables does not exceed user’s stake balance.

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/141#issuecomment-897369855):**

> Yes, spot on! We spotted this the next morning after launching the competition. Token shifting was a last minute addition to the codebase. Really glad someone spotted it, but only in the last few hours, phew!
> 
> This would allow a malicious user to completely shift all the tokens (even those not belonging to them to one side or the other!!) No funds could be stolen by the user directly (since the execution of those shifts would fail on the user level), but it could be done for personal gain (eg improving the users FLT issuance rate, or similar economic manipulation).

[](#medium-risk-findings-6)Medium Risk Findings (6)
===================================================

[](#m-01-latestmarket-used-where-marketindex-should-have-been-used)[\[M-01\] `latestMarket` used where `marketIndex` should have been used](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/9)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gpersoon, also found by 0xImpostor, cmichel, shw, hack3r-0m, jonah1005, loop and pauliax_

The functions `initializeMarket` and `_seedMarketInitially` use the variable `latestMarket`. If these functions would be called seperately from `createNewSyntheticMarket`, then `latestMarket` would have the same value for each call of `initializeMarket` and `_seedMarketInitially`

This would mean that the `latestMarket` is initialized multiple times and the previous market(s) are not initialized properly. Note: the call to addNewStakingFund could have prevented this issue, but also allows this, see separate issue.

Note: the functions can only be called by the admin, so if `createNewSyntheticMarket` and `initializeMarket` are called in combination, then it would not lead to problems, but in future release of the software the calls to `createNewSyntheticMarket` and `initializeMarket` might get separated.

[`LongShort.sol` #L304](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/LongShort.sol#L304)

    function _seedMarketInitially(uint256 initialMarketSeedForEachMarketSide, uint32 marketIndex) internal virtual {
      ...
      ISyntheticToken(syntheticTokens[latestMarket][true]).mint(PERMANENT_INITIAL_LIQUIDITY_HOLDER,initialMarketSeedForEachMarketSide);   // should be marketIndex
      ISyntheticToken(syntheticTokens[latestMarket][false]).mint(PERMANENT_INITIAL_LIQUIDITY_HOLDER,initialMarketSeedForEachMarketSide);  // should be marketIndex
    
    function initializeMarket(
        uint32 marketIndex,....)
    ...
      require(!marketExists[marketIndex], "already initialized");
      require(marketIndex <= latestMarket, "index too high");
      marketExists[marketIndex] = true;
    ..
      IStaker(staker).addNewStakingFund(
        `latestMarket`,                                       // should be marketIndex.
        syntheticTokens[latestMarket][true],   // should be marketIndex
        syntheticTokens[latestMarket][false],  // should be marketIndex
    ...

Recommend replacing `latestMarket` with `marketIndex` in the functions `initializeMarket` and `_seedMarketInitially`.

p.s. confirmed by Jason of float capital: Definitely an issue, luckily both of those functions are adminOnly. But that is definitely not ideal!

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/9#issuecomment-896001724):**

> Great spot!
> 
> ![image](https://user-images.githubusercontent.com/6032276/128869917-0121e5cb-d550-4d1e-ac25-5c97efdd2ff1.png)
> 
> Not a risk if you know about it (you just need to launch markets sequentially not in batches), but we didn’t. So 2 - medium risk is fair :)

**[DenhamPreen (Float) patched](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/9#issuecomment-897493238):**

> Resolved PR [https://github.com/Float-Capital/monorepo/pull/1106](https://github.com/Float-Capital/monorepo/pull/1106)

[](#m-02-incorrect-balance-computed-in-getusersconfirmedbutnotsettledsynthbalance)[\[M-02\] Incorrect balance computed in `getUsersConfirmedButNotSettledSynthBalance()`](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/142)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hack3r-0m and cmichel_

Consider the following state:

    long_synth_balace = 300;
    short_synth_balace = 200;
    
    marketUpdateIndex[1] = x;
    userNextPrice_currentUpdateIndex = 0;
    userNextPrice_syntheticToken_toShiftAwayFrom_marketSide[1][true] = 0;
    batched_amountSyntheticToken_toShiftAwayFrom_marketSide[1][true] = 0;

User calls `shiftPositionFromLongNextPrice(marketIndex=1, amountSyntheticTokensToShift=100)`

This results in following state changes:

    long_synth_balace = 200;
    short_synth_balace = 200;
    userNextPrice_syntheticToken_toShiftAwayFrom_marketSide[1][true] = 100;
    batched_amountSyntheticToken_toShiftAwayFrom_marketSide[1][true] = 100;
    userNextPrice_currentUpdateIndex = x+1 ;

Due to some other transactions, oracle updates twice, and now the `marketUpdateIndex[1]` is x+2 and also updating price snapshots.

When User calls `getUsersConfirmedButNotSettledSynthBalance(user, 1)`

initial condition:

    if (
      userNextPrice_currentUpdateIndex[marketIndex][user] != 0 &&
      userNextPrice_currentUpdateIndex[marketIndex][user] <= currentMarketUpdateIndex
    )

will be true; [`LongShort.sol` L532](https://github.com/hack3r-0m/2021-08-floatcapital/blob/main/contracts/contracts/LongShort.sol#L532)

    syntheticToken_priceSnapshot[marketIndex][isLong][currentMarketUpdateIndex]

This uses price of current x+2 th update while it should balance of accounting for price of x+1 th update.

**[JasoonS (Float) confirmed and disagreed with severity](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/142#issuecomment-897368280):**

> Yes good spot.
> 
> This function is view only, and is only used for view only purposes. The rest of the system will always operate correctly because it rather uses `_executeOutstandingNextPriceSettlements` than the `getUsersConfirmedButNotSettledSynthBalance`. Therefore I propose this as a **1 Low Risk** vulnerability.

**[0xean (judge) (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/142#issuecomment-905007960):**

> I am going to align with the 2 (Med Risk) severity. Reporting the incorrect position in a UI to a user could definitely lead unexpected loss of funds in a sharp market move where a user is intending on hedging elsewhere.

[](#m-03-missing-eventstimelocks-for-owneradmin-only-functions-that-change-critical-parameters)[\[M-03\] Missing events/timelocks for owner/admin only functions that change critical parameters](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/85)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0xRajeev, also found by tensors_

Owner/admin only functions that change critical parameters should emit events and have timelocks. Events allow capturing the changed parameters so that off-chain tools/interfaces can register such changes with timelocks that allow users to evaluate them and consider if they would like to engage/exit based on how they perceive the changes as affecting the trustworthiness of the protocol or profitability of the implemented financial services. The alternative of directly querying on-chain contract state for such changes is not considered practical for most users/usages.

Missing events and timelocks do not promote transparency and if such changes immediately affect users’ perception of fairness or trustworthiness, they could exit the protocol causing a reduction in liquidity which could negatively impact protocol TVL and reputation.

There are owner/admin functions that do not emit any events in `LongShort.sol`. It is not apparent that any owner/admin functions will have timelocks.

See similar High-severity [H03](https://blog.openzeppelin.com/audius-contracts-audit/#high) finding in OpenZeppelin’s Audit of Audius and Medium-severity [M01](https://blog.openzeppelin.com/uma-audit-phase-4/) finding OpenZeppelin’s Audit of UMA Phase 4

See issue page for referenced code.

Recommend adding events to all owner/admin functions that change critical parameters. Add timelocks to introduce time delays for critical parameter changes that significantly impact market/user incentives/security.

**[JasoonS (Float) acknowledged](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/85#issuecomment-897497116):**

> We will manage timelocks and multi-sigs externally to these contracts.

**[JasoonS (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/85#issuecomment-898693915):**

> I would consider this a duplicate of #84 in many ways. (or at least #84 is a sub-issue of this issue)

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/85#issuecomment-905048244):**

> duplicate of #84 as both offer solutions for dealing with privileged functionality (including the transfer of ownership). Leaving severity as 2 based on the potential risks associated with an incorrect admin change or similar.

[](#m-04-stakersol-wrong-values-returned-in-edge-cases-of-_calculatefloatpersecond)[\[M-04\] Staker.sol: Wrong values returned in edge cases of `_calculateFloatPerSecond()`](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/6)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hickuphh3_

In `_calculateFloatPerSecond()`, the edge cases where full rewards go to either the long or short token returns

`return (1e18 * k * longPrice, 0);` and

`return (0, 1e18 * k * shortPrice);` respectively.

This is however `1e18` times too large. We can verify this by checking the equivalent calculation in the ‘normal case’, where we assume all the rewards go to the short token, ie. `longRewardUnscaled = 0` and `shortRewardUnscaled = 1e18`. Plugging this into the calculation below,

`return ((longRewardUnscaled * k * longPrice) / 1e18, (shortRewardUnscaled * k * shortPrice) / 1e18);` results in

`(0, 1e18 * k * shortPrice / 1e18)` or `(0, k * shortPrice)`.

As we can see, this would result in an extremely large float token issuance rate, which would be disastrous.

The edge cases should return `(k * longPrice, 0)` and `(0, k * shortPrice)` in the cases where rewards should go fully to long and short token holders respectively.

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/6#issuecomment-895995908):**

> Fix:
> 
>     -return (1e18 * k * longPrice, 0);
>     +return (k * longPrice, 0);
> 
> and
> 
>     -return (0, 1e18 * k * shortPrice);
>     +return (0, k * shortPrice);

**[DenhamPreen (Float) patched](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/6#issuecomment-897480501):**

> Resolved [https://github.com/Float-Capital/monorepo/pull/1085](https://github.com/Float-Capital/monorepo/pull/1085)

[](#m-05-wrong-aave-usage-of-claimrewards)[\[M-05\] Wrong aave usage of `claimRewards`](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/49)
--------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by jonah1005_

Aave yield manager claims rewards with the payment token. According to aave’s document, aToken should be provided. The aave rewards would be unclaimable.

YieldManager’s logic in [L161-L170](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/YieldManagerAave.sol#L161-L170)

Reference: [https://docs.aave.com/developers/guides/liquidity-mining#claimrewards](https://docs.aave.com/developers/guides/liquidity-mining#claimrewards)

Recommend changing to

      address[] memory rewardsDepositedAssets = new address[](1);
      rewardsDepositedAssets[0] = address(aToken);

**[DenhamPreen (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/49#issuecomment-896811177):**

> Great catch!
> 
> This contract is going to be upgradable but really applicable within this context 👍

**[moose-code (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/49#issuecomment-896845365):**

> Oof yeah! Good one :)
> 
> Devil in those documentation details :)
> 
> ![image](https://user-images.githubusercontent.com/20556729/129041188-b712e09a-f735-44d4-922f-328b156e2461.png)

[](#m-06-prevent-markets-getting-stuck-when-prices-dont-move)[\[M-06\] Prevent markets getting stuck when prices don’t move](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/16)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gpersoon, also found by cmichel_

Suppose there is a synthetic token where the price stays constant, for example:

*   synthetic DAI (with a payment token of DAI the price will not move)
*   binary option token (for example tracking the USA elections; after the election results there will be no more price movements)

In that case `assetPriceHasChanged` will never be true (again) and `marketUpdateIndex[marketIndex]` will never increase. This means the `_executeOutstandingNextPrice`\* functions will never be executed, which means the market effectively will be stuck.

[`LongShort.sol` L669](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/LongShort.sol#L669)

    function `_updateSystemStateInternal`(uint32 marketIndex) internal virtual requireMarketExists(marketIndex) {
      ...
      int256 newAssetPrice = IOracleManager(oracleManagers[marketIndex]).updatePrice();
      int256 oldAssetPrice = int256(assetPrice[marketIndex]);
      bool assetPriceHasChanged = oldAssetPrice != newAssetPrice;
    
      if (assetPriceHasChanged || msg.sender == staker) {
        ....
        if (!assetPriceHasChanged) {
          return;
        }
        ....
        marketUpdateIndex[marketIndex] += 1;  // never reaches this point if the price doesn't change
    
    
    function _executeOutstandingNextPriceSettlements(address user, uint32 marketIndex) internal virtual {
      uint256 userCurrentUpdateIndex = userNextPrice_currentUpdateIndex[marketIndex][user];
      if (userCurrentUpdateIndex != 0 && userCurrentUpdateIndex <= marketUpdateIndex[marketIndex]) { // needs marketUpdateIndex[marketIndex] to be increased
        _executeOutstandingNextPriceMints(marketIndex, user, true);
        _executeOutstandingNextPriceMints(marketIndex, user, false);
        _executeOutstandingNextPriceRedeems(marketIndex, user, true);
        _executeOutstandingNextPriceRedeems(marketIndex, user, false);
        _executeOutstandingNextPriceTokenShifts(marketIndex, user, true);
        _executeOutstandingNextPriceTokenShifts(marketIndex, user, false);

Recommend enhancing `_updateSystemStateInternal` so that after a certain period of time without price movements (for example 1 day), the entire function is executed (including the `marketUpdateIndex[marketIndex]` += 1;)

**[JasoonS (Float) disputed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/16#issuecomment-896069784):**

> Good point, we thought the time since last update check wasn’t necessary.
> 
> I’ll chat with the team about what they think the risk is. But I don’t think it is 3 given that we don’t plan to launch any assets that don’t have regular change (so market would be stuck for a limited time - even if it is long).
> 
> In a lot of ways our ‘nextPriceExecution\` model is designed for this case. Some more traditional markets close for the weekend and over night. Our mechanism means that users will be able to buy and trade these assets at any time and get the asset as soon as there is an update.

**[JasoonS (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/16#issuecomment-896290768):**

> The more I think about this the more I think it is a safety feature. It is way more likely that if the oracle keeps returning the same value that something is broken (which means we can catch the issue before it negatively impacts the system by unfairly managing user funds or similar). If it really is stuck on the same value legitimately it can replace the OracleManager that is being used to help with that.

**[moose-code (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/16#issuecomment-896735385):**

> Since there is no current plan for a binary market, and the system would definitely need other accommodations to allow a binary market, since next price execution etc, this doesn’t make sense as an issue in this case. The system is built for markets where continuous price updates will occur.
> 
> Agree with Jason, if not price update is occurring, there is likely an issue with the oracle, and our system is not failing even in light of this issue. It is effectively paused until a new price update is given. As Jason mentions we can use the oracle manager to fix this

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/16#issuecomment-906047797):**

> Due to the ability to update the oracle, funds would not be lost, but it would be an availability risk (even if temporary) for the system. Based on that I am downgrading to a 2.

[](#low-risk-findings-15)Low Risk Findings (15)
===============================================

[](#l-01-missing-input-validation-on-many-functions-throughout-the-code)[\[L-01\] Missing input validation on many functions throughout the code](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/1)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by tensors, also found by 0xRajeev, JMukesh and pauliax_

Many functions throughout `LongShort.sol` and `YieldManager.sol` have no simple checks for validating inputs. Below some examples are linked. See `LongShort.sol` [L254](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/LongShort.sol#L254), and `YieldManager.sol` [L149](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/YieldManagerAave.sol#L149).

Recommend simple validations like requiring non-zero address or checking that amounts are non-zero would fix this.

**[JasoonS (Float) disputed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/1#issuecomment-895984918):**

> **0 - non-critical**
> 
> Both examples given are not vulnerabilities since they are not public functions.
> 
> [L254 in LongShort.sol](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/LongShort.sol#L254) This is an `onlyAdmin` function. We purposely removed null checks from admin functions (we will only call these functions under highly controlled circumstances with via code (ie ethers.js) that checks for forgotten arguments).
> 
> [L149 in YieldManagerAave.sol](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/YieldManagerAave.sol#L149) This function is `longShortOnly` so ONLY the LongShort contract. If you can find a bug (an actual example) in the `LongShort.sol` contract where it can give the incorrect arguments to the `YieldManagerAave` contract then this could be a valid issue.

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/1#issuecomment-905092238):**

> given the downside of not having these checks in place and for example the admin being set to a null address there seems little benefit to not having them. Downgrading to 1

[](#l-02-comment-code-mismatch-for-_balanceincentivecurve_exponent-threshold)[\[L-02\] Comment-code mismatch for `_balanceIncentiveCurve_exponent` threshold](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/89)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0xRajeev, also found by hickuphh3_

The code comment says: “// The exponent has to be less than 5 in these versions of the contracts.” but the code immediately after the comment implements a check “< 6.” It is unclear if the comment is incorrect or the check is wrong. An incorrect check may have mathematical implications. [Staker.sol L276-L277](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/Staker.sol#L276-L277)

Recommend revisiting comment and code to sync them by fixing the comment or the code whichever is incorrect.

**[JasoonS (Float) acknowledged and disagreed with severity](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/89#issuecomment-897516642):**

> Thanks - has been pointed out before. **0 non-critical**

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/89#issuecomment-905097568):**

> Per [https://docs.code4rena.com/roles/wardens/judging-criteria#estimating-risk-tl-dr](https://docs.code4rena.com/roles/wardens/judging-criteria#estimating-risk-tl-dr) - comments are a 1 (Low Risk). Agreeing with the warden here.

[](#l-03-use-of-floating-pragma)[\[L-03\] Use of floating pragma](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/96)
----------------------------------------------------------------------------------------------------------------------------------------

_Submitted by JMukesh_

[https://swcregistry.io/docs/SWC-103](https://swcregistry.io/docs/SWC-103)

`ILendingPool.sol` have floating pragma and its been used in `YieldManger.sol` [L9](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/YieldManagerAave.sol#L9).

Recommend using fixed solidity version

**[JasoonS (Float) disagreed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/96#issuecomment-897529036):**

> We want you to have fixed versions.
> 
> **0 non-critical**
> 
> **[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/96#issuecomment-905099546):** @JasoonS (Float) - I am not sure I understand your comment, the warden is stating that ILendingPool _should_ have a fixed version.
> 
> Leaving as 1 and valid for now.

[](#l-04-prevent-reentrancy)[\[L-04\] prevent reentrancy](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/13)
--------------------------------------------------------------------------------------------------------------------------------

_Submitted by gpersoon, also found by hickuphh3_

If the payment token would be an ERC777 token (or another token that has callbacks), then an reentrancy attack could be tried. Especially in `function_executeOutstandingNextPriceSettlements` multiple transfers are called, which could call callbacks. These callbacks could go to an attacker contract which could call functions of the `LongShort.sol` contract

Although I haven’t found a scenario to misuse the reentrancy its better to prevent this. `LongShort.sol` [#L1035](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/LongShort.sol#L1035)

    function _executeOutstandingNextPriceSettlements(address user, uint32 marketIndex) internal virtual {
        uint256 userCurrentUpdateIndex = userNextPrice_currentUpdateIndex[marketIndex][user];
        if (userCurrentUpdateIndex != 0 && userCurrentUpdateIndex <= marketUpdateIndex[marketIndex]) {
          _executeOutstandingNextPriceMints(marketIndex, user, true);        // transfers synth token to user
          _executeOutstandingNextPriceMints(marketIndex, user, false);       // transfers synth token to user
          _executeOutstandingNextPriceRedeems(marketIndex, user, true);  // transfers payment token to user
          _executeOutstandingNextPriceRedeems(marketIndex, user, false);  // transfers payment token to user
          _executeOutstandingNextPriceTokenShifts(marketIndex, user, true);
          _executeOutstandingNextPriceTokenShifts(marketIndex, user, false);
    
          userNextPrice_currentUpdateIndex[marketIndex][user] = 0;
    
          emit ExecuteNextPriceSettlementsUser(user, marketIndex);
        }
      }

Recommend preventing reentrancy attacks in one of the following ways:

*   make sure the payment tokens don’t have call back function / are not ERC777
*   or add reentrancy guards to \_executeOutstandingNextPriceSettlements (see [ReentrancyGuard.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol))

**[JasoonS (Float) disputed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/13#issuecomment-896048395):**

> Very good point! We are aware of this, and will make sure of this for V2 for sure.
> 
> We wrote in the readme that we will only use DAI as a payment token (there are lots of weird types of tokens that could break our system, not only tokens with hooks!)
> 
> See readme: [https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/README.md#L156](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/README.md#L156)
> 
> I now see that I didn’t mention ‘hooks’ in that comment, but it does say we will deeply analyse any potential payment token and only use DAI initially. I’ll leave this to the judges.

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/13#issuecomment-905606753):**

> Given the readme doesn’t specifically mentions hooks, I think the warden is highlighting a good thing for the sponsor to consider in future iterations. Leaving current severity.

[](#l-05-permanent_initial_liquidity_holder-not-100-safe)[\[L-05\] `PERMANENT_INITIAL_LIQUIDITY_HOLDER` not 100% safe](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/15)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gpersoon_

The initial tokens are minted to the address `PERMANENT_INITIAL_LIQUIDITY_HOLDER` The comments suggest they can never be moved from there. However `transferFrom` in `SyntheticToken.sol` allows `longShort` to move tokens from any address so also from address `PERMANENT_INITIAL_LIQUIDITY_HOLDER`.

This is unlikely to happen because the current source of `LongShort.sol` doesn’t allow for this action. However `LongShort.sol` is upgradable to in theory a future version could allow this. [LongShort.sol L34](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/LongShort.sol#L34)

    /// @notice this is the address that permanently locked initial liquidity for markets is held by.
    /// These tokens will never move so market can never have zero liquidity on a side.
    /// @dev f10a7 spells float in hex - for fun - important part is that the private key for this address in not known.
    address public constant PERMANENT_INITIAL_LIQUIDITY_HOLDER = 0xf10A7_F10A7_f10A7_F10a7_F10A7_f10a7_F10A7_f10a7;
    
    
    function _seedMarketInitially(uint256 initialMarketSeedForEachMarketSide, uint32 marketIndex) internal
    ...
      ISyntheticToken(syntheticTokens[latestMarket][true]).mint(PERMANENT_INITIAL_LIQUIDITY_HOLDER,initialMarketSeedForEachMarketSide);
      ISyntheticToken(syntheticTokens[latestMarket][false]).mint(PERMANENT_INITIAL_LIQUIDITY_HOLDER, initialMarketSeedForEachMarketSide);

[`SyntheticToken.sol` L91](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/SyntheticToken.sol#L91)

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
      if (recipient == longShort && msg.sender == longShort) {   // sender could be any address
        super._transfer(sender, recipient, amount);
        return true;
      } else {
        return super.transferFrom(sender, recipient, amount);
      }
    }

Recommend accepting the risk and document this in the contract. Or, update `transferFrom` to contain the following:

    if (recipient == longShort && msg.sender == longShort && sender!=PERMANENT_INITIAL_LIQUIDITY_HOLDER)

**[JasoonS (Float) acknowledged and disagreed with severity](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/15#issuecomment-896064211):**

> Note, even if we were to remove this initial liquidity there is no issue as long as the market has users on both sides.
> 
> This initial liquidity is solely for the first few minutes (or however long) of the market when there is no external users yet.
> 
> If the market ever has zero users (zero additional liquidity) and we were to somehow force those last tokens to be redeemed, ‘zero users’ would care that the market has collapsed and is non-functional anymore.

**[moose-code (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/15#issuecomment-896732884):**

> Interesting point but its way too far fetched we upgrade the smart contract to include a function that would ever call transferFrom from the very awkward address 0xf10A7_F10A7_f10A7_F10a7_F10A7_f10a7_F10A7\_f10a7

**[JasoonS (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/15#issuecomment-898625400):**

> tldr: there are far worse things that we could upgrade into the contracts than this where there is basically nothing to gain anyway.

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/15#issuecomment-905618881):**

> Leaving as 1, sponsor acknowledges it’s an edge case that could cause non functioning markets which certainly qualifies as “state handling” in
> 
>     1 — Low: Low: Assets are not at risk. State handling, function incorrect as to spec, issues with comments.

[](#l-06-stakersol-updating-kvalue-requires-interpolation-with-initial-timestamp)[\[L-06\] Staker.sol: Updating `kValue` requires interpolation with initial timestamp](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/69)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hickuphh3_

Updating a `kValue` of a market requires interpolation against the initial timestamp, which can be a hassle and might lead to a wrong value set from what is expected.

Consider the following scenario:

*   Initially set `kValue = 2e18`, `kPeriod = 2592000` (30 days)
*   After 15 days, would like to refresh the market incentive (start again with `kValue = 2e18`), lasting another 30 days.

In the current implementation, the admin would call `_changeMarketLaunchIncentiveParameters()` with the following inputs:

*   `period = 3888000` (45 days)
*   `kValue` needs to be worked backwards from the formula
    
    `kInitialMultiplier - (((kInitialMultiplier - 1e18) * (block.timestamp - initialTimestamp)) / kPeriod)`. To achieve the desired effect, we would get `kValue = 25e17` (formula returns 2e18 after 15 days with kPeriod = 45 days).
    

This isn’t immediately intuitive and could lead to mistakes.

Recommend that Instead of calculating from `initialTimestamp` (when `addNewStakingFund()` was called), calculate from when the market incentives were last updated. This would require a new mapping to store last updated timestamps of market incentives.

For example, using the scenario above, refreshing the market incentive would mean using inputs `period = 2592000` (30 days) with `kValue = 2e18`.

    // marketIndex => timestamp of updated market launch incentive params
    mapping(uint32 => uint256) public marketLaunchIncentive_update_timestamps;
    
    function _changeMarketLaunchIncentiveParameters(
      uint32 marketIndex,
      uint256 period,
      uint256 initialMultiplier
    ) internal virtual {
    	require(initialMultiplier >= 1e18, "marketLaunchIncentiveMultiplier must be >= 1e18");
    
      marketLaunchIncentive_period[marketIndex] = period;
      marketLaunchIncentive_multipliers[marketIndex] = initialMultiplier;
    	marketLaunchIncentive_update_timestamps[marketIndex] = block.timestamp;
    };
    
    function _getKValue(uint32 marketIndex) internal view virtual returns (uint256) {
      // Parameters controlling the float issuance multiplier.
      (uint256 kPeriod, uint256 kInitialMultiplier) = _getMarketLaunchIncentiveParameters(marketIndex);
    
      // Sanity check - under normal circumstances, the multipliers should
      // *never* be set to a value < 1e18, as there are guards against this.
      assert(kInitialMultiplier >= 1e18);
    
    	// currently: uint256 initialTimestamp = accumulativeFloatPerSyntheticTokenSnapshots[marketIndex][0].timestamp;
    	// changed to take from last updated timestamp instead of initial timestamp
      uint256 initialTimestamp = marketLaunchIncentive_update_timestamps[marketIndex];
    
      if (block.timestamp - initialTimestamp <= kPeriod) {
        return kInitialMultiplier - (((kInitialMultiplier - 1e18) * (block.timestamp - initialTimestamp)) / kPeriod);
      } else {
        return 1e18;
      }
    }

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/69#issuecomment-897445040):**

> You are right. we should probably just delete the external `changeMarketLaunchIncentiveParameters` function so that it can only be set once.

[](#l-07-tokenfactorysol-defaultadminrole-has-wrong-value-)[\[L-07\] TokenFactory.sol: DEFAULT_ADMIN_ROLE has wrong value](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/72)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hickuphh3_

`TokenFactory.sol` defines `DEFAULT_ADMIN_ROLE = keccak256("DEFAULT_ADMIN_ROLE");`, but OpenZeppelin’s `AccessControl.sol` defines `DEFAULT_ADMIN_ROLE = 0x00`, so that by default, all other roles defined will have their admin role to be `DEFAULT_ADMIN_ROLE`.

This makes the following lines erroneous:

    // Give minter roles
    SyntheticToken(syntheticToken).grantRole(DEFAULT_ADMIN_ROLE, longShort);
    SyntheticToken(syntheticToken).grantRole(MINTER_ROLE, longShort);
    SyntheticToken(syntheticToken).grantRole(PAUSER_ROLE, longShort);
    
    // Revoke roles
    SyntheticToken(syntheticToken).revokeRole(DEFAULT_ADMIN_ROLE, address(this));
    SyntheticToken(syntheticToken).revokeRole(MINTER_ROLE, address(this));
    SyntheticToken(syntheticToken).revokeRole(PAUSER_ROLE, address(this));

Due to how `grantRole()` and `revokeRole()` works, the lines above will not revert. However, note that `TokenFactory` will have `DEFAULT_ADMIN_ROLE (0x00)` instead of `LongShort`. This by itself doesn’t seem to have any adverse effects, since `TokenFactory` doesn’t do anything else apart from creating new synthetic tokens.

Nonetheless, I believe that `DEFAULT_ADMIN_ROLE` was unintentionally defined as `keccak256("DEFAULT_ADMIN_ROLE")`, and should be amended.

The revoking role order will also have to be swapped so that `DEFAULT_ADMIN_ROLE` is revoked last.

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    
    function createSyntheticToken(
      string calldata syntheticName,
      string calldata syntheticSymbol,
      address staker,
      uint32 marketIndex,
      bool isLong
    ) external override onlyLongShort returns (ISyntheticToken syntheticToken) {
    	...
      // Revoke roles
      _syntheticToken.revokeRole(MINTER_ROLE, address(this));
      _syntheticToken.revokeRole(PAUSER_ROLE, address(this));
    	_syntheticToken.revokeRole(DEFAULT_ADMIN_ROLE, address(this));
    }

**[JasoonS (Float) acknowledged](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/72#issuecomment-897463294):**

> Thanks they changed that more recently (or bad copy pasting…)

[](#l-08-yieldmanageraavesol-wrong-branch-in-depositpaymenttoken-if-amountreservedincaseofinsufficientaaveliquidity--amount)[\[L-08\] `YieldManagerAave.sol`: Wrong branch in `depositPaymentToken()` if `amountReservedInCaseOfInsufficientAaveLiquidity` == amount](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/74)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hickuphh3_

In the unlikely event `amountReservedInCaseOfInsufficientAaveLiquidity == amount`, the `else` case will be executed, which means `lendingPool.deposit()` is called with a value of zero. It would therefore be better to change the condition so that the `if` case is executed instead.

    function depositPaymentToken(uint256 amount) external override longShortOnly {
      // If amountReservedInCaseOfInsufficientAaveLiquidity isn't zero, then efficiently net the difference between the amount
      // It basically always be zero besides extreme and unlikely situations with aave.
      if (amountReservedInCaseOfInsufficientAaveLiquidity != 0) {
    		// instead of strictly greater than
        if (amountReservedInCaseOfInsufficientAaveLiquidity >= amount) {
          amountReservedInCaseOfInsufficientAaveLiquidity -= amount;
          // Return early, nothing to deposit into the lending pool
          return;
        }
    	...
    }

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/74#issuecomment-897465760):**

> Hmm, yes, the deposit function in aave will revert if zero right?
> 
> Thanks for reporting.

[](#l-09-longshort-should-not-shares-the-same-yield-manager-between-different-markets)[\[L-09\] `LongShort` should not shares the same Yield Manager between different markets](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/48)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by jonah1005, also found by cmichel and gpersoon_

`LongShort` should not shares the same Yield Manager between different markets The `LongShort` contract would not stop different markets from using the same yield manager contracts. Any extra aToken in the yield manager would be considered as market incentives in function `distributeYieldForTreasuryAndReturnMarketAllocation`. Thus, using the same yield manager for different markets would break the markets and allow users to withdraw fund that doesn’t belong to them. [`YieldManagerAave.sol` L179-L204](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/YieldManagerAave.sol#L179-L204)

Given the fluency of programming skills the dev shows, I believe they wouldn’t make this mistake on deployment. Still, I think there’s space to improve in the YieldManagerAave contract. IMHO. As it’s tightly coupled with `longshort` contract and its market logic, a initialize market function in the yield manager seems more reasonable.

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/48#issuecomment-896486601):**

> Duplicate #10
> 
> I agree there is no way I would actually make that mistake. But technically possible, so that is a fair comment.
> 
> Why not have some code in the yield manager like the following (pseudo code, not tested):
> 
>     boolean isInitialized;
>     function initializeForMarket() onlyLongShort {
>     	require(!isInitialized, "Yield Manager is already in use");
>         isInitialized = true;
>     }
> 
> And that function gets called by long short.

**[DenhamPreen (Float) resolved](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/48#issuecomment-897666556):**

> [https://github.com/Float-Capital/monorepo/pull/1139](https://github.com/Float-Capital/monorepo/pull/1139)

[](#l-10-the-address-of-aave-lendingpool-may-change)[\[L-10\] The address of Aave `lendingPool` may change](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/99)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by pauliax_

Contract `YieldManagerAave` caches `lendingPool`, however, in theory, it is possible that the implementation may change (see [L58-L65](https://github.com/aave/aave-protocol/blob/4b4545fb583fd4f400507b10f3c3114f45b8a037/contracts/configuration/LendingPoolAddressesProvider.sol#L58-L65) of Aave’s `LendingPoolAddressesProvider.sol`). I am not sure how likely in practice is that but a common solution that I see in other protocols that integrate with Aave is querying the `lendingPool` on the go (of course then you also need to handle the change in approvals).

An example solution you can see [here](https://github.com/code-423n4/2021-07-sherlock/blob/d9c610d2c3e98a412164160a787566818debeae4/contracts/strategies/AaveV2.sol#L63-L65).

**[JasoonS (Float) sponsor](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/99#issuecomment-897562485):**

> Thanks

[](#l-11-confusing-comments)[\[L-11\] confusing comments](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/12)
--------------------------------------------------------------------------------------------------------------------------------

_Submitted by gpersoon, also found by 0xImpostor_

I’ve seen comments which are confusing: `~10^31 or 10 Trillion (10^13)` ==> probably should be 2^31 `x * 5e17 ==`(x \* 10e18) / 2\` ==> probably should be 1e18/2

// [https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/Staker.sol#L19](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/Staker.sol#L19) // 2^52 ~= 4.5e15 // With an exponent of 5, the largest total liquidity possible in a market (to avoid integer overflow on exponentiation) is ~10^31 or 10 Trillion (10^13)

//[https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/Staker.sol#L480](https://github.com/code-423n4/2021-08-floatcapital/blob/main/contracts/contracts/Staker.sol#L480) // NOTE: `x * 5e17` == `(x * 10e18) / 2`

Recommend double checking the comments.

**[JasoonS (Float) confirmed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/12#issuecomment-896042626):**

> > ~10^31 or 10 Trillion (10^13) ==> probably should be 2^31
> 
> This is just an approximation to justify why the values we chose are safe. Assuming a maximum of 10 Trillion DAI (very very conservative upper estimate to market size), then that would be 10^31 DAI decimal units (so not 2^31). Can clarify this, thanks!
> 
> > x \* 5e17==(x \* 10e18) / 2\` ==> probably should be 1e18/2
> 
> Yes, we picked this one up, it should be 1e18 :)

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/12#issuecomment-905635116):**

> Based on C4’s documentation this is a 1
> 
>     1 — Low: Low: Assets are not at risk. State handling, function incorrect as to spec, issues with comments.

[](#l-12-docstring)[\[L-12\] Docstring](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/27)
--------------------------------------------------------------------------------------------------------------

_Submitted by evertkors, also found by loop_

A lot of docstrings for `marketIndex` are @param marketIndex An int32 which uniquely identifies a market. but it is a `uint32` not an `int32`

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/27#issuecomment-905637078):**

> based on [https://docs.code4rena.com/roles/wardens/judging-criteria#estimating-risk-tl-dr](https://docs.code4rena.com/roles/wardens/judging-criteria#estimating-risk-tl-dr) upgrading this to 1

[](#l-13-possibly-not-all-synths-can-be-withdrawn)[\[L-13\] Possibly not all synths can be withdrawn](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/129)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel_

The `LongShort._handleTotalPaymentTokenValueChangeForMarketWithYieldManager` function assumes that the `YieldManager` indeed withdraws all of the desired payment tokens, but it could be that they are currently lent out at Aave.

    // NB there will be issues here if not enough liquidity exists to withdraw
    // Boolean should be returned from yield manager and think how to appropriately handle this
    IYieldManager(yieldManagers[marketIndex]).removePaymentTokenFromMarket(
      uint256(-totalPaymentTokenValueChangeForMarket)
    );

Recommend trying to withdraw these tokens will then fail.

> Boolean should be returned from yield manager and think how to appropriately handle this 😁

**[JasoonS (Float) disputed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/129#issuecomment-897566013):**

> That happens on the user level, they can just try again later (our UI will give a good message).
> 
> It was designed like this.

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/129#issuecomment-906014323):**

> based on the incorrect comment in the code I am going to leave as a 1 (per - [https://docs.code4rena.com/roles/wardens/judging-criteria#estimating-risk-tl-dr](https://docs.code4rena.com/roles/wardens/judging-criteria#estimating-risk-tl-dr))
> 
> but it does look like the system is designed to handle this scenario regardless of the boolean returned (or not being returned)

[](#l-14-protocol-requires-a-running-bot-in-order-to-make-sure-trades-are-actually-executed)[\[L-14\] Protocol requires a running bot in order to make sure trades are actually executed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/3)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by tensors_

Because smart contracts need to be poked to execute, trades placed before an oracle update won’t be executed until someone else calls the function to execute queued trades. This means that a bot must run to constantly execute trades after every oracle update.

If such a bot was not running, users would have an incentive to only execute their trades after a favorable oracle update. However, having a dedicated bot run by the team centralizes the project with a single failure point. The typical solution here is to create keeper incentives for the protocol.

Recommend either making sure the team has a bot running or preferably create incentives for other users to constantly keep the queued orders executing.

**[JasoonS (Float) disputed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/3#issuecomment-895991761):**

> **0 - non-critical**
> 
> In the worst case of the bot going down, no vulnerabilities open up.
> 
> The only issue that arises is that the price won’t be tracked as accurately during those periods (but it will still track it, just not as accurately).
> 
> The protocol allows anyone to call an update, and any user interaction (non-update interaction) will also call the update if an update is due.
> 
> > If such a bot was not running, users would have an incentive to only execute their trades after a favorable oracle update.
> 
> That is great, then the incentives are working, they cannot do better than a fair price update which is ‘fair’ in my opinion.
> 
> Indeed: We have been in talks with the chainlink keeprs team to be the first project to use them when they launch on polygon. We should have mentioned this in the README. Until then we have built a robust bot.
> 
> Note, this bot is for UX, not to patch up a vulnerability.

**[moose-code (Float) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/3#issuecomment-896713143):**

> Agree with @JasoonS (Float) . The bot failing opens no vulnerabilities, the synthetics may just less closely track the underlying if no contract interactions are present.
> 
> Given rational markets with actors on both sides (long and short), and given it will always be beneficial for one side to execute the update to capitalize on the movement, its safe to assume that in a rational market the updateSystemState in every case should be called by at least one participant, meaning theoretically a bot isn’t even necessary.

**[Stentonian commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/3#issuecomment-896722256):**

> > trades placed before an oracle update won’t be executed until someone else calls the function to execute queued trades.
> 
> What function is this? There are multiple update functions so it’s not clear which one the warden is referring to. If they are referring to the function `_executeOutstandingNextPriceSettlements` (the one that they linked in the ‘Proof of concept’ section) then the warden’s statement is a non-issue. The system is designed to do exactly what the warden says. So the next statement is incorrect:
> 
> > This means that a bot must run to constantly execute trades after every oracle update.
> 
> LongShort keeps track of which trade should happen at which price for each user, so when `_executeOutstandingNextPriceSettlements` is eventually called (no matter how many price updates have occurred since the trade request) it will use the oracle’s next price update that occurred **right after the time when trade was requestd.** And `_executeOutstandingNextPriceSettlements` is called before any other action is taken by the user that would require the data from the trade having completed. No need to have a bot call this function.
> 
> If the warden is referring to another update function then it’s not clear which.
> 
> > The only issue that arises is that the price won’t be tracked as accurately during those periods (but it will still track it, just not as accurately).
> 
> This is not actually mentioned by the warden in the issue description, even tho it is a real problem. So I don’t think we need to include it here. The warden is specifically pointing out `executeOutstandingNextPriceSettlements` which will never have any issues no matter if there is a bot or not.

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/3#issuecomment-906322230):**

> There are incentives built into the market already for users to update if the bot was to stop running. Yes, the bot should be treated as a tier-1 service for a reasonable user experience and for the most efficient tracking, but the risk of this to the system as a whole locking user funds or allowing people to significantly and unfairly profit doesn’t seem to be there.
> 
> All that being said, it is a failure point within the system but one with low risk, downgrading to 1 - Low Risk.

[](#l-15-race-condition-risk-with-initialize-functions)[\[L-15\] Race-condition risk with initialize functions](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/82)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0xRajeev, also found by cmichel_

Race-condition risk with initialize functions if deployment script is not robust to create and initialize contracts atomically or if factory contracts do not create and initialize appropriately.

If this is not implemented correctly, an attacker can front-run to initialize contracts with their parameters. This, if noticed, will require a redeployment of contracts resulting in potential DoS and reputational damage. See [Short.sol L188-L193](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/LongShort.sol#L188-L193), [FloatToken.sol L21-L25](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/FloatToken.sol#L21-L25), and [Staker.sol L179-L186](https://github.com/code-423n4/2021-08-floatcapital/blob/bd419abf68e775103df6e40d8f0e8d40156c2f81/contracts/contracts/Staker.sol#L179-L186).

Recommend ensuring deployment script is robust to create and initialize contracts atomically or factory contracts create and initialize appropriately.

**[JasoonS (Float) disputed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/82#issuecomment-897490152):**

> We use open-zeppelin scripts todo this automatically.
> 
> Additionally we initialize the base implementations too to prevent any foul play by pranksters.

**[0xean (judge) commented](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/82#issuecomment-906341201):**

> Given that the contest didn’t include the scope of the scripts and that this is a risk in the contract implementation without a factory I believe this is a valid risk even if the sponsor believes its mitigated.

[](#non-critical-findings-25)Non-Critical Findings (25)
=======================================================

*   [\[N-01\] Markets cannot be initialized with payment tokens of few decimals](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/126)
*   [\[N-02\] Assuming tokens are compliant with ERC20 could cause transactions to revert unexpectedly](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/93)
*   [\[N-03\] Received amount of transfer-on-fee/deflationary tokens are not correctly accounted](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/140)
*   [\[N-04\] Interface notations are used for abstract contracts](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/86)
*   [\[N-05\] extra safety in distributeYieldForTreasuryAndReturnMarketAllocation](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/14)
*   [\[N-06\] consistently use `msg.sender` or `_msgSender()`(recommended)](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/136)
*   [\[N-07\] 0xf10A7_F10A7_f10A7_F10a7_F10A7_f10a7_F10A7\_f10a7](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/101)
*   [\[N-08\] Constant values used inline](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/11)
*   [\[N-09\] emit event at stage changes](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/138)
*   [\[N-10\] Index Events](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/55)
*   [\[N-11\] LongShort.sol & YieldManagerAave.sol: Verify / derive input arguments](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/56)
*   [\[N-12\] `LongShort.sol`: Inconsistency in \_claimAndDistributeYieldThenRebalanceMarket()](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/59)
*   [\[N-13\] Single Source of Truth](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/61)
*   [\[N-14\] Spelling Errors](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/62)
*   [\[N-15\] Staker.sol: Shift event emissions to internal functions](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/67)
*   [\[N-16\] Staker.sol: TODO add link in comment](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/68)
*   [\[N-17\] Staker.sol: withdrawAll() does not include incoming outstanding shifts to the user](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/70)
*   [\[N-18\] Multiple initialize functions](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/19)
*   [\[N-19\] FloatToken would revoke stakerAddress’s permission if msg.sender == stakerAddress](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/36)
*   [\[N-20\] Aave’s claimRewards returns the actual rewards claimed](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/100)
*   [\[N-21\] Style issues](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/111)
*   [\[N-22\] executeOutstandingNextPriceSettlementsUserMulti may exceed gas limits](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/80)
*   [\[N-23\] Missing use of requireMarketExists modifier on multiple functions](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/81)
*   [\[N-24\] Solution is susceptible to MEV, harming users.](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/30)
*   [\[N-25\] Oracle updates can be frontrun by stakers to gain a profit](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/4)

[](#gas-optimizations-21)Gas Optimizations (21)
===============================================

*   [\[G-01\] Pass time delta into internal functions](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/42)
*   [\[G-02\] Staker.sol: Cache `marketIndex`](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/63)
*   [\[G-03\] Caching state variables in local variables can save gas](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/76)
*   [\[G-04\] Unused named returns can be removed for optimization](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/79)
*   [\[G-05\] Function visibility can be changed from public to external](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/87)
*   [\[G-06\] Immutable Variables](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/53)
*   [\[G-07\] Gas: `SyntheticToken` does not use pausing functionality](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/118)
*   [\[G-08\] Internal \_withdraw, reading from storage twice.](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/26)
*   [\[G-09\] slight difference between withdraw and withdrawAll](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/17)
*   [\[G-10\] Drop require checks for synthetic tokens](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/52)
*   [\[G-11\] Increase Solc Optimiser Runs](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/54)
*   [\[G-12\] `LongShort.sol`: Cache marketUpdateIndex\[marketIndex\]](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/58)
*   [\[G-13\] `LongShort.sol`: Some math can be unchecked in \_getYieldSplit()](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/60)
*   [\[G-14\] Staker.sol: Cache shift amounts](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/64)
*   [\[G-15\] Staker.sol: Redundant zero intialization for accumulativeFloatPerSyntheticTokenSnapshots](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/66)
*   [\[G-16\] TokenFactory.sol: Appropriate type declaration to avoid numerous casting](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/71)
*   [\[G-17\] \[Optimization\] Cache length in the loop](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/97)
*   [\[G-18\] Appropriate storage variable type declaration to save on casting](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/50)
*   [\[G-19\] Cache storage access and duplicate calculations](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/106)
*   [\[G-20\] treasury state variable in `LongShort`](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/110)
*   [\[G-21\] onlyValidMarket is never used](https://github.com/code-423n4/2021-08-floatcapital-findings/issues/107)

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk10 { color: #4EC9B0; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }