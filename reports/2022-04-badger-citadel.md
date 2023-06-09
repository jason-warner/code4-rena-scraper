![BadgerDAO](/static/8935a39f6cbc74d25107718ba8b8361c/4e333/Badger.jpg)

Badger Citadel contest  
Findings & Analysis Report
===================================================

#### 2022-07-08

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (3)](#high-risk-findings-3)
    
    *   [\[H-01\] StakedCitadel doesn’t use correct balance for internal accounting](#h-01-stakedcitadel-doesnt-use-correct-balance-for-internal-accounting)
    *   [\[H-02\] StakedCitadel: wrong setupVesting function name](#h-02-stakedcitadel-wrong-setupvesting-function-name)
    *   [\[H-03\] StakedCitadel depositors can be attacked by the first depositor with depressing of vault token denomination](#h-03-stakedcitadel-depositors-can-be-attacked-by-the-first-depositor-with-depressing-of-vault-token-denomination)
*   [Medium Risk Findings (5)](#medium-risk-findings-5)
    
    *   [\[M-01\] Guaranteed citadel profit](#m-01-guaranteed-citadel-profit)
    *   [\[M-02\] Funding.deposit() doesn’t work if there is no discount set](#m-02-fundingdeposit-doesnt-work-if-there-is-no-discount-set)
    *   [\[M-03\] KnightingRound tokenOutPrice changes](#m-03-knightinground-tokenoutprice-changes)
    *   [\[M-04\] New vest reset `unlockBegin` of existing vest without removing vested amount](#m-04-new-vest-reset-unlockbegin-of-existing-vest-without-removing-vested-amount)
    *   [\[M-05\] Stale price used when `citadelPriceFlag` is cleared](#m-05-stale-price-used-when-citadelpriceflag-is-cleared)
*   [Low Risk and Non-Critical Issues](#low-risk-and-non-critical-issues)
    
    *   [L-01 New min/max values should be checked against the current stored value](#l-01-new-minmax-values-should-be-checked-against-the-current-stored-value)
    *   [L-02 Loss of precision](#l-02-loss-of-precision)
    *   [L-03 Unsafe calls to optional ERC20 functions](#l-03-unsafe-calls-to-optional-erc20-functions)
    *   [L-04 Missing checks for `address(0x0)` when assigning values to `address` state variables](#l-04-missing-checks-for-address0x0-when-assigning-values-to-address-state-variables)
    *   [L-05 `initialize` functions can be front-run](#l-05-initialize-functions-can-be-front-run)
    *   [L-06 `safeApprove()` is deprecated](#l-06-safeapprove-is-deprecated)
    *   [L-07 Upgradeable contract is missing a `__gap[50]` storage variable to allow for new storage variables in later versions](#l-07-upgradeable-contract-is-missing-a-__gap50-storage-variable-to-allow-for-new-storage-variables-in-later-versions)
    *   [L-08 Unbounded loop](#l-08-unbounded-loop)
    *   [N-01 Open TODOs](#n-01-open-todos)
    *   [N-02 Misleading comment](#n-02-misleading-comment)
    *   [N-03 Multiple definitions of an interface](#n-03-multiple-definitions-of-an-interface)
    *   [N-04 Unused file](#n-04-unused-file)
    *   [N-05 Contract header not updated after branching](#n-05-contract-header-not-updated-after-branching)
    *   [N-06 Comment not moved when function was moved](#n-06-comment-not-moved-when-function-was-moved)
    *   [N-07 Comments not updated after branching](#n-07-comments-not-updated-after-branching)
    *   [N-08 Remove `include` for ds-test](#n-08-remove-include-for-ds-test)
    *   [N-09 The `nonReentrant` `modifier` should occur before all other modifiers](#n-09-the-nonreentrant-modifier-should-occur-before-all-other-modifiers)
    *   [N-10 Solidity versions greater than the current version should not be included in the pragma range](#n-10-solidity-versions-greater-than-the-current-version-should-not-be-included-in-the-pragma-range)
    *   [N-11 Adding a `return` statement when the function defines a named return variable, is redundant](#n-11-adding-a-return-statement-when-the-function-defines-a-named-return-variable-is-redundant)
    *   [N-12 `require()`/`revert()` statements should have descriptive reason strings](#n-12-requirerevert-statements-should-have-descriptive-reason-strings)
    *   [N-13 `public` functions not called by the contract should be declared `external` instead](#n-13-public-functions-not-called-by-the-contract-should-be-declared-external-instead)
    *   [N-14 `constant`s should be defined rather than using magic numbers](#n-14-constants-should-be-defined-rather-than-using-magic-numbers)
    *   [N-15 Numeric values having to do with time should use time units for readability](#n-15-numeric-values-having-to-do-with-time-should-use-time-units-for-readability)
    *   [N-16 Constant redefined elsewhere](#n-16-constant-redefined-elsewhere)
    *   [N-17 Non-library/interface files should use fixed compiler versions, not floating ones](#n-17-non-libraryinterface-files-should-use-fixed-compiler-versions-not-floating-ones)
    *   [N-18 Typos](#n-18-typos)
    *   [N-19 File does not contain an SPDX Identifier](#n-19-file-does-not-contain-an-spdx-identifier)
    *   [N-20 File is missing NatSpec](#n-20-file-is-missing-natspec)
    *   [N-21 NatSpec is incorrect](#n-21-natspec-is-incorrect)
    *   [N-22 NatSpec is incomplete](#n-22-natspec-is-incomplete)
    *   [N-23 Event is missing `indexed` fields](#n-23-event-is-missing-indexed-fields)
    *   [N-24 Non-exploitable reentrancies](#n-24-non-exploitable-reentrancies)
    *   [N-25 `now` is deprecated](#n-25-now-is-deprecated)
*   [Gas Optimizations](#gas-optimizations)
    
    *   [Table of Contents](#table-of-contents)
    *   [G-01 `CitadelMinter.mintAndDistribute()`: L199 should be unchecked due to L193-L197](#g-01-citadelmintermintanddistribute-l199-should-be-unchecked-due-to-l193-l197)
    *   [G-02 `Funding.sol`: state variables can be tightly packed to save 1 storage slot](#g-02-fundingsol-state-variables-can-be-tightly-packed-to-save-1-storage-slot)
    *   [G-03 `Funding.initialize()`: should use memory instead of storage variable](#g-03-fundinginitialize-should-use-memory-instead-of-storage-variable)
    *   [G-04 `Funding.onlyWhenPriceNotFlagged()`: boolean comparison 147](#g-04-fundingonlywhenpricenotflagged-boolean-comparison-147)
    *   [G-05 `Funding.deposit()`: `funding.assetCumulativeFunded + _assetAmountIn` should get cached](#g-05-fundingdeposit-fundingassetcumulativefunded--_assetamountin-should-get-cached)
    *   [G-06 `Funding.getRemainingFundable()`: L236 should be unchecked due to L235](#g-06-fundinggetremainingfundable-l236-should-be-unchecked-due-to-l235)
    *   [G-07 `Funding.claimAssetToTreasury()`: `asset` should get cached](#g-07-fundingclaimassettotreasury-asset-should-get-cached)
    *   [G-08 `KnightingRound.initialize()`: should use memory instead of storage variable](#g-08-knightingroundinitialize-should-use-memory-instead-of-storage-variable)
    *   [G-09 `KnightingRound.buy()`: `saleStart`, `totalTokenIn` and `guestlist` should get cached](#g-09-knightingroundbuy-salestart-totaltokenin-and-guestlist-should-get-cached)
    *   [G-10 `KnightingRound.getTokenInLimitLeft()`: `totalTokenIn` and `tokenInLimit` should get cached + L250 should be unchecked due to L249](#g-10-knightingroundgettokeninlimitleft-totaltokenin-and-tokeninlimit-should-get-cached--l250-should-be-unchecked-due-to-l249)
    *   [G-11 `StakedCitadel.deposit()`: Use `calldata` instead of `memory`](#g-11-stakedcitadeldeposit-use-calldata-instead-of-memory)
    *   [G-12 `StakedCitadel.depositAll()`: Use `calldata` instead of `memory`](#g-12-stakedcitadeldepositall-use-calldata-instead-of-memory)
    *   [G-13 `StakedCitadel.setStrategy()`: `strategy` should get cached](#g-13-stakedcitadelsetstrategy-strategy-should-get-cached)
    *   [G-14 `StakedCitadel.earn()`: `strategy` should get cached](#g-14-stakedcitadelearn-strategy-should-get-cached)
    *   [G-15 `StakedCitadel._depositFor()`: `token` should get cached](#g-15-stakedcitadel_depositfor-token-should-get-cached)
    *   [G-16 `StakedCitadel._depositFor()`: L776 should be unchecked due to L773-L775](#g-16-stakedcitadel_depositfor-l776-should-be-unchecked-due-to-l773-l775)
    *   [G-17 `StakedCitadel._depositForWithAuthorization()`: `guestList` should get cached](#g-17-stakedcitadel_depositforwithauthorization-guestlist-should-get-cached)
    *   [G-18 `StakedCitadel._withdraw()`: `token` and `vesting` should get cached](#g-18-stakedcitadel_withdraw-token-and-vesting-should-get-cached)
    *   [G-19 `StakedCitadel._withdraw()`: L817 should be unchecked due to L816](#g-19-stakedcitadel_withdraw-l817-should-be-unchecked-due-to-l816)
    *   [G-20 `StakedCitadelLocker.sol`: state variables can be tightly packed to save 1 storage slot](#g-20-stakedcitadellockersol-state-variables-can-be-tightly-packed-to-save-1-storage-slot)
    *   [G-21 `StakedCitadelLocker.totalSupplyAtEpoch()`: Use a storage variable’s reference instead of repeatedly fetching it (`epochs[i]`)](#g-21-stakedcitadellockertotalsupplyatepoch-use-a-storage-variables-reference-instead-of-repeatedly-fetching-it-epochsi)
    *   [G-22 `StakedCitadel._withdraw()`: `maximumStake`, `minimumStake` and `stakingProxy` should get cached](#g-22-stakedcitadel_withdraw-maximumstake-minimumstake-and-stakingproxy-should-get-cached)
    *   [G-23 `StakedCitadelVester.claimableBalance()`: Help the optimizer by saving a storage variable’s reference instead of repeatedly fetching it (`vesting[recipient]`)](#g-23-stakedcitadelvesterclaimablebalance-help-the-optimizer-by-saving-a-storage-variables-reference-instead-of-repeatedly-fetching-it-vestingrecipient)
    *   [G-24 `StakedCitadelVester.vest()`: Help the optimizer by saving a storage variable’s reference instead of repeatedly fetching it (`vesting[recipient]`)](#g-24-stakedcitadelvestervest-help-the-optimizer-by-saving-a-storage-variables-reference-instead-of-repeatedly-fetching-it-vestingrecipient)
    *   [G-25 `SupplySchedule.getEpochAtTimestamp()`: `globalStartTimestamp` should get cached](#g-25-supplyschedulegetepochattimestamp-globalstarttimestamp-should-get-cached)
    *   [G-26 `SupplySchedule.getMintable()`: L105-L110 should be unchecked due to L95 and L99-L101](#g-26-supplyschedulegetmintable-l105-l110-should-be-unchecked-due-to-l95-and-l99-l101)
    *   [G-27 `SupplySchedule.getMintableDebug()`: `globalStartTimestamp` should get cached](#g-27-supplyschedulegetmintabledebug-globalstarttimestamp-should-get-cached)
    *   [G-28 `SupplySchedule.getMintableDebug()`: L200-L205 should be unchecked due to L184 and L188](#g-28-supplyschedulegetmintabledebug-l200-l205-should-be-unchecked-due-to-l184-and-l188)
    *   [G-29 No need to explicitly initialize variables with default values](#g-29-no-need-to-explicitly-initialize-variables-with-default-values)
    *   [G-30 `> 0` is less efficient than `!= 0` for unsigned integers (with proof)](#g-30--0-is-less-efficient-than--0-for-unsigned-integers-with-proof)
    *   [G-31 `>=` is cheaper than `>`](#g-31--is-cheaper-than-)
    *   [G-32 Shift Right instead of Dividing by 2](#g-32-shift-right-instead-of-dividing-by-2)
    *   [G-33 An array’s length should be cached to save gas in for-loops](#g-33-an-arrays-length-should-be-cached-to-save-gas-in-for-loops)
    *   [G-34 `++i` costs less gas compared to `i++` or `i += 1`](#g-34-i-costs-less-gas-compared-to-i-or-i--1)
    *   [G-35 Increments can be unchecked](#g-35-increments-can-be-unchecked)
    *   [G-36 Consider making some constants as non-public to save gas](#g-36-consider-making-some-constants-as-non-public-to-save-gas)
    *   [G-37 Reduce the size of error messages (Long revert Strings)](#g-37-reduce-the-size-of-error-messages-long-revert-strings)
    *   [G-38 Use Custom Errors instead of Revert Strings to save Gas](#g-38-use-custom-errors-instead-of-revert-strings-to-save-gas)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Badger Citadel smart contract system written in Solidity. The audit contest took place between April 14—April 20 2022.

[](#wardens)Wardens
-------------------

79 Wardens contributed reports to the Badger Citadel contest:

1.  IllIllI
2.  [georgypetrov](https://twitter.com/georgypetrov_)
3.  [cmichel](https://twitter.com/cmichelio)
4.  cccz
5.  VAD37
6.  0xDjango
7.  [danb](https://twitter.com/danbinnun)
8.  hyh
9.  [berndartmueller](https://twitter.com/berndartmueller)
10.  reassor
11.  TrungOre
12.  [rayn](https://twitter.com/rayn731)
13.  minhquanym
14.  [wuwe1](https://twitter.com/wuwe19)
15.  [Ruhum](https://twitter.com/0xruhum)
16.  [shenwilly](https://twitter.com/shenwilly_)
17.  kyliek
18.  gs8nrv
19.  [gzeon](https://twitter.com/gzeon)
20.  m9800
21.  0xBug
22.  [pedroais](https://twitter.com/Pedroais2/)
23.  [Dravee](https://twitter.com/JustDravee)
24.  [CertoraInc](https://twitter.com/CertoraInc) (egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, and shakedwinder)
25.  horsefacts
26.  scaraven
27.  sorrynotsorry
28.  [MaratCerby](https://twitter.com/MaratCerby)
29.  [joestakey](https://twitter.com/JoeStakey)
30.  [TomFrenchBlockchain](https://github.com/TomAFrench)
31.  remora
32.  ilan
33.  [csanuragjain](https://twitter.com/csanuragjain)
34.  [defsec](https://twitter.com/defsec_)
35.  [rfa](https://www.instagram.com/riyan_rfa/)
36.  TerrierLover
37.  [fatherOfBlocks](https://twitter.com/father0fBl0cks)
38.  0xkatana
39.  robee
40.  [ellahi](https://twitter.com/ellahinator)
41.  0x1f8b
42.  kenta
43.  [securerodd](https://twitter.com/securerodd)
44.  tchkvsky
45.  [Funen](https://instagram.com/vanensurya)
46.  kebabsec (okkothejawa and [FlameHorizon](https://twitter.com/FlameHorizon1))
47.  SolidityScan ([cyberboy](https://twitter.com/cyberboyIndia) and [zombie](https://blog.dixitaditya.com/))
48.  [teryanarmen](https://twitter.com/teryanarmenn)
49.  [z3s](https://github.com/z3s/)
50.  [0v3rf10w](https://twitter.com/_0v3rf10w)
51.  [jah](https://twitter.com/jah_s3)
52.  oyc\_109
53.  delfin454000
54.  Hawkeye (0xwags and 0xmint)
55.  hubble (ksk2345 and shri4net)
56.  [AmitN](https://www.amitnave.com/)
57.  dipp
58.  p\_crypt0
59.  peritoflores
60.  [Picodes](https://twitter.com/thePicodes)
61.  Jujic
62.  Yiko
63.  [Tomio](https://twitter.com/meidhiwirara)
64.  saian
65.  [0xAsm0d3us](https://twitter.com/0xAsm0d3us)
66.  [0xNazgul](https://twitter.com/0xNazgul)
67.  joshie
68.  slywaters
69.  Cityscape
70.  simon135
71.  [bae11](https://twitter.com/bae11evm)
72.  nahnah

This contest was judged by [Jack the Pug](https://github.com/jack-the-pug).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 8 unique vulnerabilities. Of these vulnerabilities, 3 received a risk rating in the category of HIGH severity and 5 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 58 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 48 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

[](#scope)Scope
===============

The code under review can be found within the [C4 Badger Citadel contest repository](https://github.com/code-423n4/2022-04-badger-citadel), and is composed of 8 smart contracts written in the Solidity programming language and includes 2,339 lines of Solidity code.

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

[](#high-risk-findings-3)High Risk Findings (3)
===============================================

[](#h-01-stakedcitadel-doesnt-use-correct-balance-for-internal-accounting)[\[H-01\] StakedCitadel doesn’t use correct balance for internal accounting](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/74)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by Ruhum, also found by cccz, wuwe1, VAD37, TrungOre, shenwilly, minhquanym, kyliek, danb, gs8nrv, and rayn_

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L291-L295](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L291-L295)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L772-L776](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L772-L776)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L881-L893](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L881-L893)

### [](#impact)Impact

The StakedCitadel contract’s `balance()` function is supposed to return the balance of the vault + the balance of the strategy. But, it only returns the balance of the vault. The balance is used to determine the number of shares that should be minted when depositing funds into the vault and the number of shares that should be burned when withdrawing funds from it.

Since most of the funds will be located in the strategy, the vault’s balance will be very low. Some of the issues that arise from this:

**You can’t deposit to a vault that already minted shares but has no balance of the underlying token**:

1.  fresh vault with 0 funds and 0 shares
2.  Alice deposits 10 tokens. She receives 10 shares back ([https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L887-L888](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L887-L888))
3.  Vault’s tokens are deposited into the strategy (now `balance == 0` and `totalSupply == 10`)
4.  Bob tries to deposit but the transaction fails because the contract tries to divide by zero: [https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L890](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L890) (`pool == balance()`)

**You get more shares than you should**

1.  fresh vault with 0 funds and 0 shares
2.  Alice deposits 10 tokens. She receives 10 shares back ([https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L887-L888](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L887-L888))
3.  Vault’s tokens are deposited into the strategy (now `balance == 0` and `totalSupply == 10`)
4.  Bob now first transfers 1 token to the vault so that the balance is now `1` instead of `0`.
5.  Bob deposits 5 tokens. He receives `5 * 10 / 1 == 50` shares: [https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L890](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L890)

Now, the vault received 15 tokens. 10 from Alice and 5 from Bob. But Alice only has 10 shares while Bob has 50. Thus, Bob can withdraw more tokens than he should be able to.

It simply breaks the whole accounting of the vault.

### [](#proof-of-concept)Proof of Concept

The comment says that it should be vault’s + strategy’s balance: [https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L291-L295](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L291-L295)

Here’s another vault from the badger team where the function is implemented correctly: [https://github.com/Badger-Finance/badger-vaults-1.5/blob/main/contracts/Vault.sol#L262](https://github.com/Badger-Finance/badger-vaults-1.5/blob/main/contracts/Vault.sol#L262)

### [](#recommended-mitigation-steps)Recommended Mitigation Steps

Add the strategy’s balance to the return value of the`balance()` function like [here](https://github.com/Badger-Finance/badger-vaults-1.5/blob/main/contracts/Vault.sol#L262).

**[GalloDaSballo (BadgerDAO) confirmed and commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/74#issuecomment-1107163426):**

> Agree balance must have been changed by mistake or perhaps earn should not transfer to a strategy either would work

* * *

[](#h-02-stakedcitadel-wrong-setupvesting-function-name)[\[H-02\] StakedCitadel: wrong setupVesting function name](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/9)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cccz, also found by TrungOre, wuwe1, reassor, 0xBug, georgypetrov, 0xDjango, scaraven, horsefacts, berndartmueller, CertoraInc, rayn, m9800, pedroais, and VAD37_

In the `\_withdraw` function of the StakedCitadel contract, the setupVesting function of vesting is called, while in the StakedCitadelVester contract, the function name is vest, which will cause the \_withdraw function to fail, so that the user cannot withdraw the tokens.

            IVesting(vesting).setupVesting(msg.sender, _amount, block.timestamp);
            token.safeTransfer(vesting, _amount);
            ...
        function vest(
            address recipient,
            uint256 _amount,
            uint256 _unlockBegin
        ) external {
            require(msg.sender == vault, "StakedCitadelVester: only xCTDL vault");
            require(_amount > 0, "StakedCitadelVester: cannot vest 0");
    
            vesting[recipient].lockedAmounts =
                vesting[recipient].lockedAmounts +
                _amount;
            vesting[recipient].unlockBegin = _unlockBegin;
            vesting[recipient].unlockEnd = _unlockBegin + vestingDuration;
    
            emit Vest(
                recipient,
                vesting[recipient].lockedAmounts,
                _unlockBegin,
                vesting[recipient].unlockEnd
            );
        }

### [](#proof-of-concept-1)Proof of Concept

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L830](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L830)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/interfaces/citadel/IVesting.sol#L5](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/interfaces/citadel/IVesting.sol#L5)

### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

Use the correct function name

    interface IVesting {
        function vest(
            address recipient,
            uint256 _amount,
            uint256 _unlockBegin
        ) external;
    }
    ...
    IVesting(vesting).vest(msg.sender, _amount, block.timestamp);
    token.safeTransfer(vesting, _amount);

**[dapp-whisperer (BadgerDAO) confirmed and resolved](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/9)**

* * *

[](#h-03-stakedcitadel-depositors-can-be-attacked-by-the-first-depositor-with-depressing-of-vault-token-denomination)[\[H-03\] StakedCitadel depositors can be attacked by the first depositor with depressing of vault token denomination](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/217)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hyh, also found by VAD37, cmichel, 0xDjango, berndartmueller, and danb_

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L881-L892](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L881-L892)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L293-L295](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L293-L295)

### [](#impact-1)Impact

An attacker can become the first depositor for a recently created StakedCitadel contract, providing a tiny amount of Citadel tokens by calling `deposit(1)` (raw values here, `1` is `1 wei`, `1e18` is `1 Citadel` as it has 18 decimals). Then the attacker can directly transfer, for example, `10^6*1e18 - 1` Citadel to StakedCitadel, effectively setting the cost of `1` of the vault token to be `10^6 * 1e18` Citadel. The attacker will still own 100% of the StakedCitadel’s pool being the only depositor.

All subsequent depositors will have their Citadel token investments rounded to `10^6 * 1e18`, due to the lack of precision which initial tiny deposit caused, with the remainder divided between all current depositors, i.e. the subsequent depositors lose value to the attacker.

For example, if the second depositor brings in `1.9*10^6 * 1e18` Citadel, only `1` of new vault to be issued as `1.9*10^6 * 1e18` divided by `10^6 * 1e18` will yield just `1`, which means that `2.9*10^6 * 1e18` total Citadel pool will be divided 50/50 between the second depositor and the attacker, as each have 1 wei of the total 2 wei of vault tokens, i.e. the depositor lost and the attacker gained `0.45*10^6 * 1e18` Citadel tokens.

As there are no penalties to exit with StakedCitadel.withdraw(), the attacker can remain staked for an arbitrary time, gathering the share of all new deposits’ remainder amounts.

Placing severity to be high as this is principal funds loss scenario for many users (most of depositors), easily executable, albeit only for the new StakedCitadel contract.

### [](#proof-of-concept-2)Proof of Concept

deposit() -> \_depositFor() -> \_mintSharesFor() call doesn’t require minimum amount and mints according to the provided amount:

deposit:

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L309-L311](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L309-L311)

\_depositFor:

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L764-L777](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L764-L777)

\_mintSharesFor:

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L881-L892](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L881-L892)

When StakedCitadel is new the `_pool = balance()` is just initially empty contract balance:

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L293-L295](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L293-L295)

Any deposit lower than total attacker’s stake will be fully stolen from the depositor as `0` vault tokens will be issued in this case.

### [](#references)References

The issue is similar to the `TOB-YEARN-003` one of the Trail of Bits audit of Yearn Finance:

[https://github.com/yearn/yearn-security/tree/master/audits/20210719\_ToB\_yearn\_vaultsv2](https://github.com/yearn/yearn-security/tree/master/audits/20210719_ToB_yearn_vaultsv2)

### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

A minimum for deposit value can drastically reduce the economic viability of the attack. I.e. `deposit() -> ...` can require each amount to surpass the threshold, and then an attacker would have to provide too big direct investment to capture any meaningful share of the subsequent deposits.

An alternative is to require only the first depositor to freeze big enough initial amount of liquidity. This approach has been used long enough by various projects, for example in Uniswap V2:

[https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L119-L121](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L119-L121)

**[GalloDaSballo (BadgerDAO) acknowledged, disagreed with severity and commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/217#issuecomment-1106938360):**

> Disagree with the dramatic effect the warden is implying.
> 
> Agree with the finding as this is a property of vault based systems

> Also worth noting that anyone else can still get more deposits in and get their fair share, it’s just that the first deposit would now require a deposit of at least `vault.balanceOf` in order to get the fair amount of shares (which at this point would be rebased to be 1 = `prevBalanceOf`)

**[jack-the-pug (judge) commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/217#issuecomment-1140871615):**

> I believe this is a valid `High` even though the precondition of this attack is quite strict (the attacker has to be the 1st depositor).
> 
> The impact is not just a regular precision loss, but with the pricePerShare of the vault being manipulated to an extreme value, all regular users will lose up to the pricePerShare of the deposited amount due to huge precision loss.

* * *

[](#medium-risk-findings-5)Medium Risk Findings (5)
===================================================

[](#m-01-guaranteed-citadel-profit)[\[M-01\] Guaranteed citadel profit](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/71)
------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by georgypetrov_

User can sandwich `mintAndDistribute` function if mintable is high enough

*   Deposit before
*   Withdraw after
*   Take after 21 days citadels

### [](#proof-of-concept-3)Proof of Concept

`mintAndDistribute` increase a price of staking share, that allows to withdraw more than deposited. user takes part of distributed citadels, so different users have smaller profit from distribution

### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

Call `mintAndDistribute` through flashbots

**[GalloDaSballo (BadgerDAO) confirmed, disagreed with severity and commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/71#issuecomment-1107167747):**

> My interpretation of the finding is that there’s no linear vesting in the way more rewards are distributed so they can be frontrun.
> 
> I have to disagree in that taking 21 days of exposure to a random token in order to gain a small sub 1% gain is probably not what I’d call a smart move.
> 
> That said, I believe the front-running finding to be valid, and while I disagree with High I believe the finding to have validity

**[jack-the-pug (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/71#issuecomment-1140386812):**

> Downgrading to `Medium` as this attack vector is not economically profitable in practice (because of the 21 days vesting).

* * *

[](#m-02-fundingdeposit-doesnt-work-if-there-is-no-discount-set)[\[M-02\] Funding.deposit() doesn’t work if there is no discount set](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/149)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by Ruhum, also found by TrungOre, MaratCerby, 0xBug, minhquanym, shenwilly, 0xDjango, remora, danb, IllIllI, pedroais, m9800, and hyh_

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L177](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L177)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L202](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L202)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L184](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L184)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L769](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L769)

### [](#impact-2)Impact

The Funding contract’s `deposit()` function uses the `getAmountOut()` function to determine how many citadel tokens the user should receive for their deposit. But, if no discount is set, the function always returns 0. Now the `deposit()` function tries to deposit 0 tokens for the user through the StakedCitadel contract. But, that function requires the number of tokens to be `!= 0`. The transaction reverts.

This means, that no deposits are possible. Unless there is a discount.

### [](#proof-of-concept-4)Proof of Concept

`Funding.deposit()` calls `getAmountOut()`: [https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L177](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L177)

Here’s the [`getAmountOut()` function](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L202):

        function getAmountOut(uint256 _assetAmountIn)
            public
            view
            returns (uint256 citadelAmount_)
        {
            uint256 citadelAmountWithoutDiscount = _assetAmountIn * citadelPriceInAsset;
    
            if (funding.discount > 0) {
                citadelAmount_ =
                    (citadelAmountWithoutDiscount * MAX_BPS) /
                    (MAX_BPS - funding.discount);
            }
    
            // unless the above if block is executed, `citadelAmount_` is 0 when this line is executed.
            // 0 = 0 / x
            citadelAmount_ = citadelAmount_ / assetDecimalsNormalizationValue;
        }

Call to `StakedCitadel.depositFor()`: [https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L184](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/Funding.sol#L184)

require statement that makes the whole transaction revert: [https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L769](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/StakedCitadel.sol#L769)

### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

Change the `getAmountOut()` function to:

        function getAmountOut(uint256 _assetAmountIn)
            public
            view
            returns (uint256 citadelAmount_)
        {
    
            uint256 citadelAmount_ = _assetAmountIn * citadelPriceInAsset;
    
            if (funding.discount > 0) {
                citadelAmount_ =
                    (citadelAmount_ * MAX_BPS) /
                    (MAX_BPS - funding.discount);
            }
    
            citadelAmount_ = citadelAmount_ / assetDecimalsNormalizationValue;
        }

**[shuklaayush (BadgerDAO) confirmed](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/149)**

* * *

[](#m-03-knightinground-tokenoutprice-changes)[\[M-03\] KnightingRound tokenOutPrice changes](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/73)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by reassor, also found by cccz and cmichel_

`Function.buy` buys the tokens for whatever price is set as `tokenOutPrice`. This might lead to accidental collisions or front-running attacks when user is trying to buy the tokens and his transaction is being included after the transaction of changing the price of the token via `setTokenOutPrice`.

Scenario:

1.  User wants to `buy` tokens and can see price `tokenOutPrice`
2.  User likes the price and issues a transaction to `buy` tokens
3.  At the same time `CONTRACT_GOVERNANCE_ROLE` account is increasing `tokenOutPrice` through `setTokenOutPrice`
4.  `setTokenOutPrice` transaction is included before user’s `buy` transaction
5.  User buys tokens with the price he was not aware of

Another variation of this attack can be performed using front-running.

### [](#proof-of-concept-5)Proof of Concept

*   [https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/KnightingRound.sol#L162-L204](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/KnightingRound.sol#L162-L204)

### [](#tools-used)Tools Used

Manual Review / VSCode

### [](#recommended-mitigation-steps-5)Recommended Mitigation Steps

It is recommended to add additional parameter `uint256 believedPrice` to `KnightingRound.buy` function and check if `believedPrice` is equal to `tokenOutPrice`.

**[GalloDaSballo (BadgerDAO) confirmed](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/73)**

* * *

[](#m-04-new-vest-reset-unlockbegin-of-existing-vest-without-removing-vested-amount)[\[M-04\] New vest reset `unlockBegin` of existing vest without removing vested amount](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/158)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gzeon, also found by cccz, TrungOre, minhquanym, cmichel, 0xDjango, and rayn_

[https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L143](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L143)

[https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L109](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L109)

### [](#impact-3)Impact

When `vest` is called by xCTDL vault, the previous amount will re-lock according to the new vesting timeline. While this is as described in L127, `claimableBalance` might revert due to underflow if `vesting[recipient].claimedAmounts` > 0 because the user will need to vest the `claimedAmounts` again which should not be an expected behavior as it is already vested.

### [](#proof-of-concept-6)Proof of Concept

[https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L143](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L143)

            vesting[recipient].lockedAmounts =
                vesting[recipient].lockedAmounts +
                _amount;
            vesting[recipient].unlockBegin = _unlockBegin;
            vesting[recipient].unlockEnd = _unlockBegin + vestingDuration;

[https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L109](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadelVester.sol#L109)

            uint256 locked = vesting[recipient].lockedAmounts;
            uint256 claimed = vesting[recipient].claimedAmounts;
            if (block.timestamp >= vesting[recipient].unlockEnd) {
                return locked - claimed;
            }
            return
                ((locked * (block.timestamp - vesting[recipient].unlockBegin)) /
                    (vesting[recipient].unlockEnd -
                        vesting[recipient].unlockBegin)) - claimed;

### [](#recommended-mitigation-steps-6)Recommended Mitigation Steps

Reset claimedAmounts on new vest

            vesting[recipient].lockedAmounts =
                vesting[recipient].lockedAmounts - 
                vesting[recipient].claimedAmounts +
                _amount;
            vesting[recipient].claimedAmounts = 0
            vesting[recipient].unlockBegin = _unlockBegin;
            vesting[recipient].unlockEnd = _unlockBegin + vestingDuration;

**[shuklaayush (BadgerDAO) confirmed and commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/158#issuecomment-1110273728):**

> I think this is valid and was fixed in [https://github.com/Citadel-DAO/citadel-contracts/pull/44](https://github.com/Citadel-DAO/citadel-contracts/pull/44)

**[jack-the-pug (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/158#issuecomment-1140759899):**

> I’m downgrading this to Medium as there are no funds directly at risk, but a malfunction and leak of value. The user will have to wait for a longer than expected time to claim their vested funds.

* * *

[](#m-05-stale-price-used-when-citadelpriceflag-is-cleared)[\[M-05\] Stale price used when `citadelPriceFlag` is cleared](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/176)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by IllIllI_

During the [video](https://drive.google.com/file/d/1hCzQrgZEsbd0t2mtuaXm7Cp3YS-ZIlw3/view?usp=sharing) it was explained that the policy operations team was meant to be a nimble group that could change protocol values considered to be safe. Further, it was explained that since pricing comes from an oracle, and there would have to be unusual coordination between the two to affect outcomes, the group was given the ability to clear the pricing flag to get things moving again once the price was determined to be valid

### [](#impact-4)Impact

If an oracle price falls out of the valid min/max range, the `citadelPriceFlag` is set to true, but the out-of-bounds value is not stored. If the policy operations team calls `clearCitadelPriceFlag()`, the stale price from before the flag will be used. Not only is it an issue because of stale prices, but this means the policy op team now has a way to affect pricing not under the control of the oracle (i.e. no unusual coordination required to affect an outcome). Incorrect pricing leads to incorrect asset valuations, and loss of funds.

### [](#proof-of-concept-7)Proof of Concept

The flag is set but the price is not stored File: src/Funding.sol (lines [427-437](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/Funding.sol#L427-L437))

            if (
                _citadelPriceInAsset < minCitadelPriceInAsset ||
                _citadelPriceInAsset > maxCitadelPriceInAsset
            ) {
                citadelPriceFlag = true;
                emit CitadelPriceFlag(
                    _citadelPriceInAsset,
                    minCitadelPriceInAsset,
                    maxCitadelPriceInAsset
                );
            } else {

### [](#tools-used-1)Tools Used

Code inspection

### [](#recommended-mitigation-steps-7)Recommended Mitigation Steps

Always set the `citadelPriceInAsset`

**[shuklaayush (BadgerDAO) confirmed and commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/176#issuecomment-1124328765):**

> Makes sense. It’s best to update the price even when it’s flagged

**[jack-the-pug (judge) commented](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/176#issuecomment-1146741831):**

> This is a very good catch! `citadelPriceInAsset` is not updated when `citadelPriceFlag` is set, therefore clearing the flag will not approve the out of range price but continues with a stale price before the out of range price.

* * *

[](#low-risk-and-non-critical-issues)Low Risk and Non-Critical Issues
=====================================================================

For this contest, 58 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/180) by **IllIllI** received the top score from the judge.

_The following wardens also submitted reports: [hyh](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/235), [sorrynotsorry](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/144), [berndartmueller](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/122), [csanuragjain](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/114), [ilan](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/212), [kyliek](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/134), [Ruhum](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/157), [joestakey](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/223), [defsec](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/170), [reassor](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/98), [TerrierLover](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/110), [TomFrenchBlockchain](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/31), [CertoraInc](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/164), [ellahi](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/177), [robee](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/15), [shenwilly](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/57), [TrungOre](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/76), [danb](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/150), [Dravee](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/90), [fatherOfBlocks](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/23), [hubble](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/206), [AmitN](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/185), [Funen](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/130), [horsefacts](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/103), [kebabsec](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/101), [kenta](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/227), [scaraven](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/93), [securerodd](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/77), [tchkvsky](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/220), [0xkatana](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/86), [rayn](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/199), [SolidityScan](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/155), [0x1f8b](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/118), [0xDjango](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/207), [cmichel](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/63), [delfin454000](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/78), [dipp](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/191), [gs8nrv](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/183), [gzeon](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/161), [Hawkeye](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/231), [jah](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/82), [m9800](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/234), [minhquanym](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/84), [oyc\_109](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/54), [p\_crypt0](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/8), [peritoflores](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/213), [Picodes](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/99), [remora](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/138), [teryanarmen](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/163), [VAD37](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/41), [z3s](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/58), [0v3rf10w](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/128), [georgypetrov](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/72), [Jujic](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/168), [MaratCerby](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/24), [rfa](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/153), and [Yiko](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/10)._

[](#l-01-new-minmax-values-should-be-checked-against-the-current-stored-value)\[L-01\] New min/max values should be checked against the current stored value
------------------------------------------------------------------------------------------------------------------------------------------------------------

If `citadelPriceInAsset` is above the new max or below the new min, the next update will likely have a similar value and immediately cause problems. The code should require that the current value falls within the new range

1.  File: src/Funding.sol (lines [402-403](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/Funding.sol#L402-L403))

            minCitadelPriceInAsset = _minPrice;
            maxCitadelPriceInAsset = _maxPrice;

[](#l-02-loss-of-precision)\[L-02\] Loss of precision
-----------------------------------------------------

If `tokenOutPrice` is less than `tokenInNormalizationValue`, then the amount will be zero for some amounts. The caller of `getAmountOut()` should revert if `tokenOutAmount` ends up being zero

1.  File: src/KnightingRound.sol (lines [239-241](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/KnightingRound.sol#L239-L241))

            tokenOutAmount_ =
                (_tokenInAmount * tokenOutPrice) /
                tokenInNormalizationValue;

[](#l-03-unsafe-calls-to-optional-erc20-functions)\[L-03\] Unsafe calls to optional ERC20 functions
---------------------------------------------------------------------------------------------------

`decimals()`, `name()` and `symbol()` are optional parts of the ERC20 specification, so there are tokens that do not implement them. It’s not safe to cast arbitrary token addresses in order to call these functions. If `IERC20Metadata` is to be relied on, that should be the variable type of the token variable, rather than it being `address`, so the compiler can verify that types correctly match, rather than this being a runtime failure. See [this](https://github.com/code-423n4/2021-05-yield-findings/issues/32) prior instance of this issue which was marked as Low risk. Do [this](https://github.com/boringcrypto/BoringSolidity/blob/c73ed73afa9273fbce93095ef177513191782254/contracts/libraries/BoringERC20.sol#L49-L55) to resolve the issue.

1.  File: src/interfaces/erc20/IERC20.sol (lines [14-18](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/interfaces/erc20/IERC20.sol#L14-L18))

        function name() external view returns (string memory);
    
        function symbol() external view returns (string memory);
    
        function decimals() external view returns (uint256);

2.  File: src/KnightingRound.sol (line [148](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/KnightingRound.sol#L148))

            tokenInNormalizationValue = 10**tokenIn.decimals();

3.  File: src/StakedCitadel.sol (line [218](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadel.sol#L218))

                    abi.encodePacked(_defaultNamePrefix, namedToken.name())

4.  File: src/StakedCitadel.sol (line [226](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadel.sol#L226))

                    abi.encodePacked(_symbolSymbolPrefix, namedToken.symbol())

[](#l-04-missing-checks-for-address0x0-when-assigning-values-to-address-state-variables)\[L-04\] Missing checks for `address(0x0)` when assigning values to `address` state variables
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: external/StakedCitadelLocker.sol (line [186](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L186))

            stakingProxy = _staking;

2.  File: src/lib/SettAccessControl.sol (line [39](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/SettAccessControl.sol#L39))

            strategist = _strategist;

3.  File: src/lib/SettAccessControl.sol (line [46](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/SettAccessControl.sol#L46))

            keeper = _keeper;

4.  File: src/lib/SettAccessControl.sol (line [53](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/SettAccessControl.sol#L53))

            governance = _governance;

[](#l-05-initialize-functions-can-be-front-run)\[L-05\] `initialize` functions can be front-run
-----------------------------------------------------------------------------------------------

See [this](https://github.com/code-423n4/2021-10-badgerdao-findings/issues/40) finding from a prior badger-dao contest for details

1.  File: src/CitadelMinter.sol (line [109](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/CitadelMinter.sol#L109))

        function initialize(

2.  File: src/KnightingRound.sol (line [119](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/KnightingRound.sol#L119))

        ) external initializer {

3.  File: src/Funding.sol (line [112](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/Funding.sol#L112))

        ) external initializer {

4.  File: src/StakedCitadel.sol (line [179](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadel.sol#L179))

        ) public initializer whenNotPaused {

[](#l-06-safeapprove-is-deprecated)\[L-06\] `safeApprove()` is deprecated
-------------------------------------------------------------------------

[Deprecated](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/bfff03c0d2a59bcd8e2ead1da9aed9edf0080d05/contracts/token/ERC20/utils/SafeERC20.sol#L38-L45) in favor of `safeIncreaseAllowance()` and `safeDecreaseAllowance()`

1.  File: src/CitadelMinter.sol (line [133](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L133))

            IERC20Upgradeable(_citadelToken).safeApprove(_xCitadel, type(uint256).max);

2.  File: src/CitadelMinter.sol (line [136](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L136))

            IERC20Upgradeable(_xCitadel).safeApprove(_xCitadelLocker, type(uint256).max);

3.  File: src/Funding.sol (line [142](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L142))

            IERC20(_citadel).safeApprove(address(_xCitadel), type(uint256).max);

[](#l-07-upgradeable-contract-is-missing-a-__gap50-storage-variable-to-allow-for-new-storage-variables-in-later-versions)\[L-07\] Upgradeable contract is missing a `__gap[50]` storage variable to allow for new storage variables in later versions
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See [this](https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps) link for a description of this storage variable. While some contracts may not currently be sub-classed, adding the variable now protects against forgetting to add it in the future.

1.  File: external/StakedCitadelLocker.sol (line [26](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L26))

    contract StakedCitadelLocker is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable {

2.  File: src/CitadelMinter.sol (lines [23-25](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L23-L25))

    contract CitadelMinter is
        GlobalAccessControlManaged,
        ReentrancyGuardUpgradeable

3.  File: src/CitadelToken.sol (line [8](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelToken.sol#L8))

    contract CitadelToken is GlobalAccessControlManaged, ERC20Upgradeable {

4.  File: src/Funding.sol (line [17](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L17))

    contract Funding is GlobalAccessControlManaged, ReentrancyGuardUpgradeable {

5.  File: src/GlobalAccessControl.sol (lines [19-21](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L19-L21))

    contract GlobalAccessControl is
        AccessControlEnumerableUpgradeable,
        PausableUpgradeable

6.  File: src/KnightingRound.sol (line [16](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L16))

    contract KnightingRound is GlobalAccessControlManaged, ReentrancyGuardUpgradeable {

7.  File: src/lib/GlobalAccessControlManaged.sol (line [12](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L12))

    contract GlobalAccessControlManaged is PausableUpgradeable {

8.  File: src/StakedCitadel.sol (lines [59-63](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L59-L63))

    contract StakedCitadel is
        ERC20Upgradeable,
        SettAccessControl,
        PausableUpgradeable,
        ReentrancyGuardUpgradeable

9.  File: src/StakedCitadelVester.sol (lines [14-16](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadelVester.sol#L14-L16))

    contract StakedCitadelVester is
        GlobalAccessControlManaged,
        ReentrancyGuardUpgradeable

[](#l-08-unbounded-loop)\[L-08\] Unbounded loop
-----------------------------------------------

If there are too many pools, the function may run out of gas while returning them. It’s best to allow for a start offset and maximum length, so data can be returned in batches that don’t run out of gas

1.  File: src/CitadelMinter.sol (lines [143-147](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/CitadelMinter.sol#L143-L147))

        function getFundingPoolWeights()
            external
            view
            returns (address[] memory pools, uint256[] memory weights)
        {

[](#n-01-open-todos)\[N-01\] Open TODOs
---------------------------------------

Code architecture, incentives, and error handling/reporting questions/issues should be resolved before deployment

1.  File: src/Funding.sol (line [15](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L15))

     * TODO: Better revert strings

2.  File: src/Funding.sol (line [61](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L61))

        // TODO: we should conform to some interface here

3.  File: src/Funding.sol (line [183](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L183))

            // TODO: Check gas costs. How does this relate to market buying if you do want to deposit to xCTDL?

4.  File: src/GlobalAccessControl.sol (line [106](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L106))

        /// TODO: Add string -> hash EnumerableSet to a new RoleRegistry contract for easy on-chain viewing.

5.  File: src/KnightingRound.sol (line [14](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L14))

     * TODO: Better revert strings

6.  File: src/SupplySchedule.sol (line [159](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L159))

            // TODO: Require this epoch is in the future. What happens if no data is set? (It just fails to mint until set)

[](#n-02-misleading-comment)\[N-02\] Misleading comment
-------------------------------------------------------

The value of `transferFromDisabled` is never updated, let alone in an `initialize()` function. I don’t see any bugs related to this, but this comment makes it seem as though something was overlooked when branching.

1.  File: src/GlobalAccessControl.sol (line [51](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L51))

        bool public transferFromDisabled; // Set to true in initialize

[](#n-03-multiple-definitions-of-an-interface)\[N-03\] Multiple definitions of an interface
-------------------------------------------------------------------------------------------

These are the only two differences between `IEmptyStrategy` and `IStrategy`. `IEmptyStrategy` should be changed to be `is IStrategy` and remove the duplicate functions

1.  File: src/interfaces/badger/IEmptyStrategy.sol (lines [12-14](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/interfaces/badger/IEmptyStrategy.sol#L12-L14))

        function initialize(address vault, address want) external;
    
        function getName() external view returns (string memory);

[](#n-04-unused-file)\[N-04\] Unused file
-----------------------------------------

1.  File: src/interfaces/convex/BoringMath.sol (line [1](https://github.com/code-423n4/2022-04-badger-citadel/blob/main/src/interfaces/convex/BoringMath.sol#L1))

    // SPDX-License-Identifier: MIT

[](#n-05-contract-header-not-updated-after-branching)\[N-05\] Contract header not updated after branching
---------------------------------------------------------------------------------------------------------

1.  File: src/GlobalAccessControl.sol (lines [12-17](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/GlobalAccessControl.sol#L12-L17))

    /**
     * @title Badger Geyser
     @dev Tracks stakes and pledged tokens to be distributed, for use with
     @dev BadgerTree merkle distribution system. An arbitrary number of tokens to
     distribute can be specified.
     */

[](#n-06-comment-not-moved-when-function-was-moved)\[N-06\] Comment not moved when function was moved
-----------------------------------------------------------------------------------------------------

1.  File: src/SupplySchedule.sol (lines [52-53](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/SupplySchedule.sol#L52-L53))

        // @dev duplicate of getMintable() with debug print added
        // @dev this function is out of scope for reviews and audits

[](#n-07-comments-not-updated-after-branching)\[N-07\] Comments not updated after branching
-------------------------------------------------------------------------------------------

There are a lot of references to the old owner-related code. The comments should be updated to talk about the new RBAC system

1.  File: src/KnightingRound.sol

    $ grep owner src/KnightingRound.sol
         * @notice Finalize the sale after sale duration. Can only be called by owner
         * @notice Update the sale start time. Can only be called by owner
         * @notice Update sale duration. Can only be called by owner
         * @notice Modify the tokenOut price in. Can only be called by owner
         * @notice Update the `tokenIn` receipient address. Can only be called by owner
         * @notice Update the guestlist address. Can only be called by owner
         * @notice Modify the max tokenIn that this contract can take. Can only be called by owner
         * @notice Transfers out any tokens accidentally sent to the contract. Can only be called by owner

The price calulation seems inverted since this comment was first written, so it should be updated to reflect the new calculation: 2. File: src/KnightingRound.sol (line [43](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/KnightingRound.sol#L43))

        /// eg. 1 WBTC (8 decimals) = 40,000 CTDL ==> price = 10^8 / 40,000

[](#n-08-remove-include-for-ds-test)\[N-08\] Remove `include` for ds-test
-------------------------------------------------------------------------

Test code should not be mixed in with production code. The production version should be extended and have its functions overridden for testing purposes

1.  File: src/SupplySchedule.sol (line [4](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L4))

    import "ds-test/test.sol";

[](#n-09-the-nonreentrant-modifier-should-occur-before-all-other-modifiers)\[N-09\] The `nonReentrant` `modifier` should occur before all other modifiers
---------------------------------------------------------------------------------------------------------------------------------------------------------

This is a best-practice to protect against reentrancy in other modifiers

1.  File: src/CitadelMinter.sol (line [173](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L173))

            nonReentrant

2.  File: src/CitadelMinter.sol (line [254](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L254))

            nonReentrant

3.  File: src/CitadelMinter.sol (line [298](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L298))

        ) external onlyRole(POLICY_OPERATIONS_ROLE) gacPausable nonReentrant {

4.  File: src/Funding.sol (line [167](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L167))

            nonReentrant

5.  File: src/Funding.sol (line [318](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L318))

            nonReentrant

6.  File: src/KnightingRound.sol (line [402](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L402))

        function sweep(address _token) external gacPausable nonReentrant onlyRole(TREASURY_OPERATIONS_ROLE) {

[](#n-10-solidity-versions-greater-than-the-current-version-should-not-be-included-in-the-pragma-range)\[N-10\] Solidity versions greater than the current version should not be included in the pragma range
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The below pragmas should be `<` 0.9.0, not `<=`

    $ grep '<= 0.9.0' src/*/*/*
    src/interfaces/badger/IBadgerGuestlist.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/badger/IBadgerVipGuestlist.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/badger/IEmptyStrategy.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/badger/IStrategy.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/badger/IVault.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/citadel/ICitadelToken.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/citadel/IGac.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/citadel/IStakedCitadelLocker.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/citadel/ISupplySchedule.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/citadel/IVesting.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/convex/BoringMath.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/convex/IRewardStaking.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/convex/IStakingProxy.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/convex/MathUtil.sol:pragma solidity >= 0.5.0 <= 0.9.0;
    src/interfaces/erc20/IERC20.sol:pragma solidity >= 0.5.0 <= 0.9.0;

[](#n-11-adding-a-return-statement-when-the-function-defines-a-named-return-variable-is-redundant)\[N-11\] Adding a `return` statement when the function defines a named return variable, is redundant
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: external/StakedCitadelLocker.sol (line [272](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L272))

            return userRewards;

2.  File: external/StakedCitadelLocker.sol (line [311](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L311))

            return amount;

3.  File: external/StakedCitadelLocker.sol (line [338](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L338))

            return amount;

4.  File: external/StakedCitadelLocker.sol (line [399](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L399))

            return supply;

5.  File: external/StakedCitadelLocker.sol (line [417](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L417))

            return supply;

[](#n-12-requirerevert-statements-should-have-descriptive-reason-strings)\[N-12\] `require()`/`revert()` statements should have descriptive reason strings
----------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: external/MedianOracle.sol (line [68](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L68))

            require(reportExpirationTimeSec_ <= MAX_REPORT_EXPIRATION_TIME);

2.  File: external/MedianOracle.sol (line [69](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L69))

            require(minimumProviders_ > 0);

3.  File: external/MedianOracle.sol (line [84](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L84))

            require(reportExpirationTimeSec_ <= MAX_REPORT_EXPIRATION_TIME);

4.  File: external/MedianOracle.sol (line [109](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L109))

            require(minimumProviders_ > 0);

5.  File: external/MedianOracle.sol (line [123](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L123))

            require(timestamps[0] > 0);

6.  File: external/MedianOracle.sol (line [129](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L129))

            require(timestamps[index_recent].add(reportDelaySec) <= now);

7.  File: external/MedianOracle.sol (line [143](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L143))

            require (providerReports[providerAddress][0].timestamp > 0);

8.  File: external/MedianOracle.sol (line [211](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L211))

            require(providerReports[provider][0].timestamp == 0);

9.  File: external/StakedCitadelLocker.sol (line [126](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L126))

            require(_stakingToken != address(0)); // dev: _stakingToken address should not be zero

10.  File: external/StakedCitadelLocker.sol (line [163](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L163))

            require(rewardData[_rewardsToken].lastUpdateTime == 0);

11.  File: external/StakedCitadelLocker.sol (line [178](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L178))

            require(rewardData[_rewardsToken].lastUpdateTime > 0);

12.  File: external/StakedCitadelLocker.sol (line [812](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L812))

            require(rewardDistributors[_rewardsToken][msg.sender]);

13.  File: src/lib/GlobalAccessControlManaged.sol (line [81](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L81))

            require(gac.hasRole(PAUSER_ROLE, msg.sender));

14.  File: src/lib/GlobalAccessControlManaged.sol (line [86](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L86))

            require(gac.hasRole(UNPAUSER_ROLE, msg.sender));

15.  File: src/StakedCitadel.sol (line [180](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L180))

            require(_token != address(0)); // dev: _token address should not be zero

16.  File: src/StakedCitadel.sol (line [181](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L181))

            require(_governance != address(0)); // dev: _governance address should not be zero

17.  File: src/StakedCitadel.sol (line [182](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L182))

            require(_keeper != address(0)); // dev: _keeper address should not be zero

18.  File: src/StakedCitadel.sol (line [183](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L183))

            require(_guardian != address(0)); // dev: _guardian address should not be zero

19.  File: src/StakedCitadel.sol (line [184](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L184))

            require(_treasury != address(0)); // dev: _treasury address should not be zero

20.  File: src/StakedCitadel.sol (line [185](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L185))

            require(_strategist != address(0)); // dev: _strategist address should not be zero

21.  File: src/StakedCitadel.sol (line [186](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L186))

            require(_badgerTree != address(0)); // dev: _badgerTree address should not be zero

22.  File: src/StakedCitadel.sol (line [187](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L187))

            require(_vesting != address(0)); // dev: _vesting address should not be zero

[](#n-13-public-functions-not-called-by-the-contract-should-be-declared-external-instead)\[N-13\] `public` functions not called by the contract should be declared `external` instead
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Contracts [are allowed](https://docs.soliditylang.org/en/latest/contracts.html#function-overriding) to override their parents’ functions and change the visibility from `external` to `public`.

1.  File: external/StakedCitadelLocker.sol (lines [121-125](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L121-L125))

        function initialize(
            address _stakingToken,
            string calldata name,
            string calldata symbol
        ) public initializer {

2.  File: external/StakedCitadelLocker.sol (line [142](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L142))

        function decimals() public view returns (uint8) {

3.  File: external/StakedCitadelLocker.sol (line [145](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L145))

        function name() public view returns (string memory) {

4.  File: external/StakedCitadelLocker.sol (line [148](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L148))

        function symbol() public view returns (string memory) {

5.  File: external/StakedCitadelLocker.sol (line [151](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L151))

        function version() public view returns(uint256){

6.  File: external/StakedCitadelLocker.sol (lines [158-162](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L158-L162))

        function addReward(
            address _rewardsToken,
            address _distributor,
            bool _useBoost
        ) public onlyOwner {

7.  File: external/StakedCitadelLocker.sol (line [250](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L250))

        function lastTimeRewardApplicable(address _rewardsToken) public view returns(uint256) {

8.  File: src/CitadelToken.sol (lines [22-26](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelToken.sol#L22-L26))

        function initialize(
            string memory _name,
            string memory _symbol,
            address _gac
        ) public initializer {

9.  File: src/Funding.sol (line [223](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L223))

        function getStakedCitadelAmountOut(uint256 _assetAmountIn) public view returns (uint256 xCitadelAmount_) {

10.  File: src/lib/GlobalAccessControlManaged.sol (lines [27-29](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L27-L29))

        function __GlobalAccessControlManaged_init(address _globalAccessControl)
            public
            onlyInitializing

11.  File: src/lib/SettAccessControl.sol (line [51](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/SettAccessControl.sol#L51))

        function setGovernance(address _governance) public {

12.  File: src/StakedCitadel.sol (lines [167-179](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L167-L179))

        function initialize(
            address _token,
            address _governance,
            address _keeper,
            address _guardian,
            address _treasury,
            address _strategist,
            address _badgerTree,
            address _vesting,
            string memory _name,
            string memory _symbol,
            uint256[4] memory _feeConfig
        ) public initializer whenNotPaused {

13.  File: src/StakedCitadel.sol (line [284](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L284))

        function getPricePerFullShare() public view returns (uint256) {

14.  File: src/SupplySchedule.sol (line [43](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L43))

        function initialize(address _gac) public initializer {

15.  File: src/SupplySchedule.sol (line [79](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L79))

        function getEmissionsForCurrentEpoch() public view returns (uint256) {

[](#n-14-constants-should-be-defined-rather-than-using-magic-numbers)\[N-14\] `constant`s should be defined rather than using magic numbers
-------------------------------------------------------------------------------------------------------------------------------------------

1.  File: external/StakedCitadelLocker.sol (line [131](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L131))

            _decimals = 18;

2.  File: external/StakedCitadelLocker.sol (line [201](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L201))

            require(_max < 1500, "over max payment"); //max 15%

3.  File: external/StakedCitadelLocker.sol (line [202](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L202))

            require(_rate < 30000, "over max rate"); //max 3x

4.  File: external/StakedCitadelLocker.sol (line [211](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L211))

            require(_rate <= 500, "over max rate"); //max 5% per epoch

5.  File: external/StakedCitadelLocker.sol (line [232](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L232))

                    rewardData[_rewardsToken].rewardRate).mul(1e18).div(rewardData[_rewardsToken].useBoost ? boostedSupply : lockedSupply)

6.  File: external/StakedCitadelLocker.sol (line [243](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L243))

            ).div(1e18).add(rewards[_user][_rewardsToken]);

7.  File: external/StakedCitadelLocker.sol (line [428](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L428))

            for (uint256 i = 0; i < 128; i++) {

8.  File: src/CitadelMinter.sol (line [272](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L272))

                require(_weight <= 10000, "exceed max funding pool weight");

9.  File: src/StakedCitadel.sol (line [178](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L178))

            uint256[4] memory _feeConfig

10.  File: src/StakedCitadel.sol (line [203](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L203))

                _feeConfig[3] <= MANAGEMENT_FEE_HARD_CAP,

11.  File: src/StakedCitadel.sol (line [250](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L250))

            managementFee = _feeConfig[3];

12.  File: src/StakedCitadel.sol (line [255](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L255))

            toEarnBps = 9_500; // initial value of toEarnBps // 95% is invested to the strategy, 5% for cheap withdrawals

13.  File: src/SupplySchedule.sol (line [170](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L170))

            epochRate[0] = 593962000000000000000000 / epochLength;

14.  File: src/SupplySchedule.sol (line [171](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L171))

            epochRate[1] = 591445000000000000000000 / epochLength;

15.  File: src/SupplySchedule.sol (line [172](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L172))

            epochRate[2] = 585021000000000000000000 / epochLength;

16.  File: src/SupplySchedule.sol (line [173](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L173))

            epochRate[3] = 574138000000000000000000 / epochLength;

17.  File: src/SupplySchedule.sol (line [173](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L173))

            epochRate[3] = 574138000000000000000000 / epochLength;

18.  File: src/SupplySchedule.sol (line [174](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L174))

            epochRate[4] = 558275000000000000000000 / epochLength;

19.  File: src/SupplySchedule.sol (line [174](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L174))

            epochRate[4] = 558275000000000000000000 / epochLength;

20.  File: src/SupplySchedule.sol (line [175](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L175))

            epochRate[5] = 536986000000000000000000 / epochLength;

21.  File: src/SupplySchedule.sol (line [175](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L175))

            epochRate[5] = 536986000000000000000000 / epochLength;

[](#n-15-numeric-values-having-to-do-with-time-should-use-time-units-for-readability)\[N-15\] Numeric values having to do with time should use time units for readability
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

There are [units](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#time-units) for seconds, minutes, hours, days, and weeks

1.  File: external/StakedCitadelLocker.sol (line [70](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L70))

        uint256 public constant rewardsDuration = 86400; // 1 day

2.  File: external/StakedCitadelLocker.sol (line [70](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L70))

        uint256 public constant rewardsDuration = 86400; // 1 day

3.  File: src/StakedCitadelVester.sol (line [34](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadelVester.sol#L34))

        uint256 public constant INITIAL_VESTING_DURATION = 86400 * 21; // 21 days of vesting

4.  File: src/StakedCitadelVester.sol (line [34](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadelVester.sol#L34))

        uint256 public constant INITIAL_VESTING_DURATION = 86400 * 21; // 21 days of vesting

[](#n-16-constant-redefined-elsewhere)\[N-16\] Constant redefined elsewhere
---------------------------------------------------------------------------

Consider defining in only one contract so that values cannot become out of sync when only one location is updated

1.  File: src/Funding.sol (lines [21-22](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L21-L22))

        bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
            keccak256("CONTRACT_GOVERNANCE_ROLE");

seen in src/CitadelMinter.sol

2.  File: src/Funding.sol (lines [23-24](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L23-L24))

        bytes32 public constant POLICY_OPERATIONS_ROLE =
            keccak256("POLICY_OPERATIONS_ROLE");

seen in src/CitadelMinter.sol

3.  File: src/GlobalAccessControl.sol (lines [25-26](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L25-L26))

        bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
            keccak256("CONTRACT_GOVERNANCE_ROLE");

seen in src/Funding.sol

4.  File: src/GlobalAccessControl.sol (lines [32-33](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L32-L33))

        bytes32 public constant POLICY_OPERATIONS_ROLE =
            keccak256("POLICY_OPERATIONS_ROLE");

seen in src/Funding.sol

5.  File: src/GlobalAccessControl.sol (lines [34-35](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L34-L35))

        bytes32 public constant TREASURY_OPERATIONS_ROLE =
            keccak256("TREASURY_OPERATIONS_ROLE");

seen in src/Funding.sol

6.  File: src/GlobalAccessControl.sol (line [37](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L37))

        bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");

seen in src/Funding.sol

7.  File: src/GlobalAccessControl.sol (lines [46-47](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L46-L47))

        bytes32 public constant CITADEL_MINTER_ROLE =
            keccak256("CITADEL_MINTER_ROLE");

seen in src/CitadelToken.sol

8.  File: src/KnightingRound.sol (lines [19-20](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L19-L20))

        bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
            keccak256("CONTRACT_GOVERNANCE_ROLE");

seen in src/GlobalAccessControl.sol

9.  File: src/KnightingRound.sol (lines [21-22](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L21-L22))

        bytes32 public constant TREASURY_GOVERNANCE_ROLE =
            keccak256("TREASURY_GOVERNANCE_ROLE");

seen in src/GlobalAccessControl.sol

10.  File: src/KnightingRound.sol (lines [24-25](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L24-L25))

        bytes32 public constant TECH_OPERATIONS_ROLE =
            keccak256("TECH_OPERATIONS_ROLE");

seen in src/GlobalAccessControl.sol

11.  File: src/KnightingRound.sol (lines [26-27](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L26-L27))

        bytes32 public constant TREASURY_OPERATIONS_ROLE =
            keccak256("TREASURY_OPERATIONS_ROLE");

seen in src/GlobalAccessControl.sol

12.  File: src/lib/GlobalAccessControlManaged.sol (line [15](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L15))

        bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

seen in src/GlobalAccessControl.sol

13.  File: src/lib/GlobalAccessControlManaged.sol (line [16](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L16))

        bytes32 public constant UNPAUSER_ROLE = keccak256("UNPAUSER_ROLE");

seen in src/GlobalAccessControl.sol

14.  File: src/StakedCitadel.sol (line [112](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L112))

        uint256 public constant MAX_BPS = 10_000;

seen in src/Funding.sol

15.  File: src/StakedCitadelVester.sol (lines [20-21](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadelVester.sol#L20-L21))

        bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
            keccak256("CONTRACT_GOVERNANCE_ROLE");

seen in src/KnightingRound.sol

16.  File: src/SupplySchedule.sol (lines [22-23](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/SupplySchedule.sol#L22-L23))

        bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
            keccak256("CONTRACT_GOVERNANCE_ROLE");

seen in src/StakedCitadelVester.sol

[](#n-17-non-libraryinterface-files-should-use-fixed-compiler-versions-not-floating-ones)\[N-17\] Non-library/interface files should use fixed compiler versions, not floating ones
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: src/CitadelToken.sol (line [2](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelToken.sol#L2))

    pragma solidity ^0.8.0;

2.  File: src/GlobalAccessControl.sol (line [3](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/GlobalAccessControl.sol#L3))

    pragma solidity ^0.8.0;

3.  File: src/lib/GlobalAccessControlManaged.sol (line [3](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L3))

    pragma solidity ^0.8.12;

[](#n-18-typos)\[N-18\] Typos
-----------------------------

1.  File: external/StakedCitadelLocker.sol (line [300](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L300))

                    //stop now as no futher checks are needed

futher

2.  File: src/CitadelMinter.sol (line [102](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/CitadelMinter.sol#L102))

         * @dev this contract is intended to be the only way citadel is minted, with the expection of the initial minting event

expection

3.  File: src/Funding.sol (line [289](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L289))

         * @param _assetCap New max cumulatiive amountIn

cumulatiive

4.  File: src/Funding.sol (line [333](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L333))

        /// @dev We let assets accumulate and batch transfer to treasury (rather than transfer atomically on each deposi)t for user gas savings

deposi)t

5.  File: src/KnightingRound.sol (line [342](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L342))

         * @notice Update the `tokenIn` receipient address. Can only be called by owner

receipient

6.  File: src/lib/GlobalAccessControlManaged.sol (line [24](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L24))

         * @dev this is assumed to be used in the initializer of the inhereiting contract

inhereiting

7.  File: src/lib/GlobalAccessControlManaged.sol (line [60](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/lib/GlobalAccessControlManaged.sol#L60))

        // @dev used to faciliate extra contract-specific permissioned accounts

faciliate

8.  File: src/StakedCitadel.sol (line [81](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/StakedCitadel.sol#L81))

        address public badgerTree; // Address we send tokens too via reportAdditionalTokens

too -> to

[](#n-19-file-does-not-contain-an-spdx-identifier)\[N-19\] File does not contain an SPDX Identifier
---------------------------------------------------------------------------------------------------

1.  File: external/MedianOracle.sol (line [0](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L0))

    pragma solidity 0.4.24;

[](#n-20-file-is-missing-natspec)\[N-20\] File is missing NatSpec
-----------------------------------------------------------------

1.  File: external/StakedCitadelLocker.sol (line [0](https://github.com/Citadel-DAO/staked-citadel-locker/blob/980088335adf7fdc62aa9a0c2556b37c01605dd4/src/StakedCitadelLocker.sol#L0))

    // SPDX-License-Identifier: MIT

2.  File: src/interfaces/badger/IBadgerGuestlist.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/badger/IBadgerGuestlist.sol#L0))

    // SPDX-License-Identifier: MIT

3.  File: src/interfaces/badger/IBadgerVipGuestlist.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/badger/IBadgerVipGuestlist.sol#L0))

    // SPDX-License-Identifier: MIT

4.  File: src/interfaces/badger/IEmptyStrategy.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/badger/IEmptyStrategy.sol#L0))

    // SPDX-License-Identifier: MIT

5.  File: src/interfaces/badger/IStrategy.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/badger/IStrategy.sol#L0))

    // SPDX-License-Identifier: MIT

6.  File: src/interfaces/badger/IVault.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/badger/IVault.sol#L0))

    // SPDX-License-Identifier: MIT

7.  File: src/interfaces/citadel/ICitadelToken.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/citadel/ICitadelToken.sol#L0))

    // SPDX-License-Identifier: MIT

8.  File: src/interfaces/citadel/IGac.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/citadel/IGac.sol#L0))

    /// SPDX-License-Identifier: MIT

9.  File: src/interfaces/citadel/IMedianOracle.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/citadel/IMedianOracle.sol#L0))

    /// SPDX-License-Identifier: MIT

10.  File: src/interfaces/citadel/IStakedCitadelLocker.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/citadel/IStakedCitadelLocker.sol#L0))

    // SPDX-License-Identifier: MIT

11.  File: src/interfaces/citadel/ISupplySchedule.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/citadel/ISupplySchedule.sol#L0))

    // SPDX-License-Identifier: MIT

12.  File: src/interfaces/citadel/IVesting.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/citadel/IVesting.sol#L0))

    // SPDX-License-Identifier: MIT

13.  File: src/interfaces/convex/IRewardStaking.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/convex/IRewardStaking.sol#L0))

    // SPDX-License-Identifier: MIT

14.  File: src/interfaces/convex/IStakingProxy.sol (line [0](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/interfaces/convex/IStakingProxy.sol#L0))

    // SPDX-License-Identifier: MIT

[](#n-21-natspec-is-incorrect)\[N-21\] NatSpec is incorrect
-----------------------------------------------------------

Wrong parameter description

1.  File: src/Funding.sol (line [160](https://github.com/code-423n4/2022-04-badger-citadel/blob/18f8c392b6fc303fe95602eba6303725023e53da/src/Funding.sol#L160))

         * @param _minCitadelOut ID of DAO to vote for

[](#n-22-natspec-is-incomplete)\[N-22\] NatSpec is incomplete
-------------------------------------------------------------

1.  File: src/Funding.sol (lines [95-112](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/Funding.sol#L95-L112))

        /**
         * @notice Initializer.
         * @param _gac Global access control
         * @param _citadel The token this contract will return in a trade
         * @param _asset The token this contract will receive in a trade
         * @param _xCitadel Staked citadel, citadel will be granted to funders in this form
         * @param _saleRecipient The address receiving the proceeds of the sale - will be citadel multisig
         * @param _assetCap The max asset that the contract can take
         */
        function initialize(
            address _gac,
            address _citadel,
            address _asset,
            address _xCitadel,
            address _saleRecipient,
            address _citadelPriceInAssetOracle,
            uint256 _assetCap
        ) external initializer {

Missing: `@param _citadelPriceInAssetOracle`

2.  File: src/KnightingRound.sol (lines [98-119](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/KnightingRound.sol#L98-L119))

        /**
         * @notice Initializer.
         * @param _tokenOut The token this contract will return in a trade (citadel)
         * @param _tokenIn The token this contract will receive in a trade
         * @param _saleStart The time when tokens can be first purchased
         * @param _saleDuration The duration of the token sale
         * @param _tokenOutPrice The tokenOut per tokenIn price
         * @param _saleRecipient The address receiving the proceeds of the sale - will be citadel multisig
         * @param _guestlist Address that will manage auction approvals
         * @param _tokenInLimit The max tokenIn that the contract can take
         */
        function initialize(
            address _globalAccessControl,
            address _tokenOut,
            address _tokenIn,
            uint256 _saleStart,
            uint256 _saleDuration,
            uint256 _tokenOutPrice,
            address _saleRecipient,
            address _guestlist,
            uint256 _tokenInLimit
        ) external initializer {

Missing: `@param _globalAccessControl`

3.  File: src/StakedCitadel.sol (lines [154-179](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L154-L179))

        /// @notice Initializes the Sett. Can only be called once, ideally when the contract is deployed.
        /// @param _token Address of the token that can be deposited into the sett.
        /// @param _governance Address authorized as governance.
        /// @param _keeper Address authorized as keeper.
        /// @param _guardian Address authorized as guardian.
        /// @param _treasury Address to distribute governance fees/rewards to.
        /// @param _strategist Address authorized as strategist.
        /// @param _badgerTree Address of badgerTree used for emissions.
        /// @param _name Specify a custom sett name. Leave empty for default value.
        /// @param _symbol Specify a custom sett symbol. Leave empty for default value.
        /// @param _feeConfig Values for the 4 different types of fees charges by the sett
        ///         [performanceFeeGovernance, performanceFeeStrategist, withdrawToVault, managementFee]
        ///         Each fee should be less than the constant hard-caps defined above.
        function initialize(
            address _token,
            address _governance,
            address _keeper,
            address _guardian,
            address _treasury,
            address _strategist,
            address _badgerTree,
            address _vesting,
            string memory _name,
            string memory _symbol,
            uint256[4] memory _feeConfig
        ) public initializer whenNotPaused {

Missing: `@param _vesting`

4.  File: src/StakedCitadel.sol (lines [357-367](https://github.com/code-423n4/2022-04-badger-citadel/blob/dab143a990a9c355578fbb15cd3c884614e33f42/src/StakedCitadel.sol#L357-L367))

        /// @notice Deposits `_amount` tokens, issuing shares to `recipient`.
        ///         Checks the guestlist to verify that `recipient` is authorized to make a deposit for the specified `_amount`.
        ///         Note that deposits are not accepted when the Sett is paused or when `pausedDeposit` is true.
        /// @dev See `_depositForWithAuthorization` for details on guestlist authorization.
        /// @param _recipient Address to issue the Sett shares to.
        /// @param _amount Quantity of tokens to deposit.
        function depositFor(
            address _recipient,
            uint256 _amount,
            bytes32[] memory proof
        ) external whenNotPaused {

Missing: `@param proof`

[](#n-23-event-is-missing-indexed-fields)\[N-23\] Event is missing `indexed` fields
-----------------------------------------------------------------------------------

Each `event` should use three `indexed` fields if there are three or more fields

[See original submission](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/180) for details.

[](#n-24-non-exploitable-reentrancies)\[N-24\] Non-exploitable reentrancies
---------------------------------------------------------------------------

    Reentrancy in CitadelMinter.mintAndDistribute() (src/CitadelMinter.sol#169-243):
    External calls:
    - citadelToken.mint(address(this),mintable) (src/CitadelMinter.sol#178-180)
    - IVault(cachedXCitadel).deposit(lockingAmount) (src/CitadelMinter.sol#195-197)
    - xCitadelLocker.notifyRewardAmount(address(cachedXCitadel),xCitadelToLockers) (src/CitadelMinter.sol#201-205)
    - IERC20Upgradeable(address(citadelToken)).safeTransfer(address(cachedXCitadel),stakingAmount) (src/CitadelMinter.sol#217-218)
    - _transferToFundingPools(fundingAmount) (src/CitadelMinter.sol#230-231)
    - returndata = address(token).functionCall(data,SafeERC20: low-level call failed) (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol#93)
    - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#137)
    - IERC20Upgradeable(address(citadelToken)).safeTransfer(pool,amount) (src/CitadelMinter.sol#351-353)
    External calls sending eth:
    - _transferToFundingPools(fundingAmount) (src/CitadelMinter.sol#230-231)
    - (success,returndata) = target.call{value: value}(data) (node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol#137)
    State variables written after the call(s):
    - lastMintTimestamp = block.timestamp (src/CitadelMinter.sol#240-241)

    Reentrancy in StakedCitadel._withdraw(uint256) (src/StakedCitadel.sol#808-840):
    External calls:
    - IStrategy(strategy).withdraw(_toWithdraw) (src/StakedCitadel.sol#818-819)
    - IVesting(vesting).setupVesting(msg.sender,_amount,block.timestamp) (src/StakedCitadel.sol#830-831)
    - token.safeTransfer(vesting,_amount) (src/StakedCitadel.sol#831-833)
    State variables written after the call(s):
    - _mintSharesFor(treasury,_fee,balance() - _fee) (src/StakedCitadel.sol#836-837)
    - _balances[account] += amount (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#268)
    - _mintSharesFor(treasury,_fee,balance() - _fee) (src/StakedCitadel.sol#836-837)
    - _totalSupply += amount (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#267)

    Reentrancy in StakedCitadel._depositFor(address,uint256) (src/StakedCitadel.sol#764-779):
    External calls:
    - token.safeTransferFrom(msg.sender,address(this),_amount) (src/StakedCitadel.sol#774-775)
    State variables written after the call(s):
    - _mintSharesFor(_recipient,_after - _before,_pool) (src/StakedCitadel.sol#776-777)
    - _balances[account] += amount (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#268)
    - _mintSharesFor(_recipient,_after - _before,_pool) (src/StakedCitadel.sol#776-777)
    - _totalSupply += amount (node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol#267)
    Reentrancy in Funding.updateCitadelPriceInAsset() (src/Funding.sol#414-443):
    External calls:
    - (_citadelPriceInAsset,_valid) = IMedianOracle(citadelPriceInAssetOracle).getData() (src/Funding.sol#422-423)
    State variables written after the call(s):
    - citadelPriceFlag = true (src/Funding.sol#431-432)
    - citadelPriceInAsset = _citadelPriceInAsset (src/Funding.sol#438-439)

[](#n-25-now-is-deprecated)\[N-25\] `now` is deprecated
-------------------------------------------------------

Use `block.timestamp` instead

1.  File: external/MedianOracle.sol (line [129](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L129))

            require(timestamps[index_recent].add(reportDelaySec) <= now);

2.  File: external/MedianOracle.sol (line [131](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L131))

            reports[index_past].timestamp = now;

3.  File: external/MedianOracle.sol (line [134](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L134))

            emit ProviderReportPushed(providerAddress, payload, now);

4.  File: external/MedianOracle.sol (line [161](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L161))

            uint256 minValidTimestamp =  now.sub(reportExpirationTimeSec);

5.  File: external/MedianOracle.sol (line [162](https://github.com/ampleforth/market-oracle/blob/5e7fd1506784f074748ab6bd5df740ca2227b14f/contracts/MedianOracle.sol#L162))

            uint256 maxValidTimestamp =  now.sub(reportDelaySec);

* * *

[](#gas-optimizations)Gas Optimizations
=======================================

For this contest, 48 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/68) by **Dravee** received the top score from the judge.

_The following wardens also submitted reports: [IllIllI](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/181), [joestakey](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/224), [TomFrenchBlockchain](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/30), [defsec](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/162), [rfa](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/152), [Tomio](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/230), [0xkatana](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/85), [fatherOfBlocks](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/20), [saian](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/136), [sorrynotsorry](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/145), [TerrierLover](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/109), [TrungOre](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/75), [CertoraInc](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/166), [0x1f8b](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/117), [0xAsm0d3us](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/11), [0xNazgul](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/91), [gzeon](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/160), [joshie](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/133), [kenta](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/229), [robee](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/16), [horsefacts](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/104), [ilan](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/211), [securerodd](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/79), [slywaters](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/1), [tchkvsky](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/232), [0v3rf10w](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/127), [berndartmueller](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/121), [Cityscape](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/196), [ellahi](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/179), [gs8nrv](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/193), [simon135](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/204), [SolidityScan](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/156), [teryanarmen](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/169), [z3s](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/59), [0xBug](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/50), [0xDjango](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/209), [Funen](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/132), [jah](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/35), [kebabsec](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/102), [MaratCerby](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/111), [oyc\_109](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/52), [bae11](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/29), [csanuragjain](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/115), [delfin454000](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/80), [Hawkeye](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/233), [nahnah](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/226), and [rayn](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/200)._

[](#table-of-contents)Table of Contents
---------------------------------------

See [original submission](https://github.com/code-423n4/2022-04-badger-citadel-findings/issues/68).

[](#g-01-citadelmintermintanddistribute-l199-should-be-unchecked-due-to-l193-l197)\[G-01\] `CitadelMinter.mintAndDistribute()`: L199 should be unchecked due to L193-L197
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Solidity version 0.8+ comes with implicit overflow and underflow checks on unsigned integers. When an overflow or an underflow isn’t possible (as an example, when a comparison is made before the arithmetic operation), some gas can be saved by using an `unchecked` block: [https://docs.soliditylang.org/en/v0.8.10/control-structures.html#checked-or-unchecked-arithmetic](https://docs.soliditylang.org/en/v0.8.10/control-structures.html#checked-or-unchecked-arithmetic)

I suggest wrapping with an `unchecked` block here (see `@audit` tag):

    File: CitadelMinter.sol
    169:     function mintAndDistribute()
    ...
    193:             uint256 beforeAmount = cachedXCitadel.balanceOf(address(this));
    194: 
    195:             IVault(cachedXCitadel).deposit(lockingAmount);
    196: 
    197:             uint256 afterAmount = cachedXCitadel.balanceOf(address(this));
    198: 
    199:             uint256 xCitadelToLockers = afterAmount - beforeAmount; 

[](#g-02-fundingsol-state-variables-can-be-tightly-packed-to-save-1-storage-slot)\[G-02\] `Funding.sol`: state variables can be tightly packed to save 1 storage slot
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

From (see `@audit` tags):

    File: Funding.sol
    38:     uint256 public maxCitadelPriceInAsset;  //@audit gas: 32 bytes size
    39:     bool public citadelPriceFlag; //@audit gas: 1 byte size, can be tightly packed
    40: 
    41:     uint256 public assetDecimalsNormalizationValue; //@audit gas: 32 bytes size
    42: 
    43:     address public citadelPriceInAssetOracle; //@audit gas: 20 bytes size
    44:     address public saleRecipient; //@audit gas: 20 bytes size
    45: 

to:

    File: Funding.sol
          uint256 public maxCitadelPriceInAsset;  //@audit gas: 32 bytes size
          bool public citadelPriceFlag; //@audit gas: 1 byte size, can be tightly packed
      
          address public citadelPriceInAssetOracle; //@audit gas: 20 bytes size
          address public saleRecipient; //@audit gas: 20 bytes size
    
          uint256 public assetDecimalsNormalizationValue; //@audit gas: 32 bytes size

[](#g-03-fundinginitialize-should-use-memory-instead-of-storage-variable)\[G-03\] `Funding.initialize()`: should use memory instead of storage variable
-------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tag:

    File: Funding.sol
    104:     function initialize(
    ...
    127:         asset = IERC20(_asset);
    ...
    134:         assetDecimalsNormalizationValue = 10**asset.decimals(); //@audit gas: should use 10**IERC20(_asset).decimals()

[](#g-04-fundingonlywhenpricenotflagged-boolean-comparison-147)\[G-04\] `Funding.onlyWhenPriceNotFlagged()`: boolean comparison 147
-----------------------------------------------------------------------------------------------------------------------------------

Comparing to a constant (`true` or `false`) is a bit more expensive than directly checking the returned boolean value. I suggest using `if(directValue)` instead of `if(directValue == true)` and `if(!directValue)` instead of `if(directValue == false)` here (see `@audit` tag):

    File: Funding.sol
    145:     modifier onlyWhenPriceNotFlagged() {
    146:         require(
    147:             citadelPriceFlag == false, //@audit gas: instead of comparing to a constant, just use "!citadelPriceFlag"
    148:             "Funding: citadel price from oracle flagged and pending review"
    149:         );
    150:         _;
    151:     }

[](#g-05-fundingdeposit-fundingassetcumulativefunded--_assetamountin-should-get-cached)\[G-05\] `Funding.deposit()`: `funding.assetCumulativeFunded + _assetAmountIn` should get cached
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: Funding.sol
    163:     function deposit(uint256 _assetAmountIn, uint256 _minCitadelOut)
    164:         external
    165:         onlyWhenPriceNotFlagged
    166:         gacPausable
    167:         nonReentrant
    168:         returns (uint256 citadelAmount_)
    169:     {
    170:         require(_assetAmountIn > 0, "_assetAmountIn must not be 0");
    171:         require(
    172:             funding.assetCumulativeFunded + _assetAmountIn <= funding.assetCap, //@audit gas: should cache "funding.assetCumulativeFunded + _assetAmountIn" (SLOAD 1 + calculation)
    173:             "asset funding cap exceeded"
    174:         );
    175:         funding.assetCumulativeFunded = funding.assetCumulativeFunded + _assetAmountIn; //@audit gas: should use cached "funding.assetCumulativeFunded + _assetAmountIn"  (SLOAD 2 + calculation)

[](#g-06-fundinggetremainingfundable-l236-should-be-unchecked-due-to-l235)\[G-06\] `Funding.getRemainingFundable()`: L236 should be unchecked due to L235
---------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tag:

    File: Funding.sol
    232:     function getRemainingFundable() external view returns (uint256 limitLeft_) {
    233:         uint256 assetCumulativeFunded = funding.assetCumulativeFunded;
    234:         uint256 assetCap = funding.assetCap;
    235:         if (assetCumulativeFunded < assetCap) {
    236:             limitLeft_ = assetCap - assetCumulativeFunded; 
    237:         }
    238:     }

[](#g-07-fundingclaimassettotreasury-asset-should-get-cached)\[G-07\] `Funding.claimAssetToTreasury()`: `asset` should get cached
---------------------------------------------------------------------------------------------------------------------------------

See `@audit` tag:

    File: Funding.sol
    334:     function claimAssetToTreasury()
    335:         external
    336:         gacPausable
    337:         onlyRole(TREASURY_OPERATIONS_ROLE)
    338:     {
    339:         uint256 amount = asset.balanceOf(address(this)); //@audit gas: should cache "asset" (SLOAD 1)
    340:         require(amount > 0, "nothing to claim");
    341:         asset.safeTransfer(saleRecipient, amount);//@audit gas: should use cached "asset" (SLOAD 2)
    342: 
    343:         emit ClaimToTreasury(address(asset), amount);//@audit gas: should use cached "asset" (SLOAD 3)
    344:     }

[](#g-08-knightingroundinitialize-should-use-memory-instead-of-storage-variable)\[G-08\] `KnightingRound.initialize()`: should use memory instead of storage variable
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tag:

    File: KnightingRound.sol
    109:     function initialize(
    ...
    140:         tokenIn = ERC20Upgradeable(_tokenIn);
    ...
    148:         tokenInNormalizationValue = 10**tokenIn.decimals();  //@audit gas: should use 10**ERC20Upgradeable(_tokenIn).decimals()

[](#g-09-knightingroundbuy-salestart-totaltokenin-and-guestlist-should-get-cached)\[G-09\] `KnightingRound.buy()`: `saleStart`, `totalTokenIn` and `guestlist` should get cached
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: KnightingRound.sol
    162:     function buy(
    ...
    167:         require(saleStart <= block.timestamp, "KnightingRound: not started"); //@audit gas: should cache saleStart (SLOAD 1)
    168:         require(
    169:             block.timestamp < saleStart + saleDuration, //@audit gas: should use cached saleStart (SLOAD 2)
    ...
    173:         require(
    174:             totalTokenIn + _tokenInAmount <= tokenInLimit, //@audit gas: should cache totalTokenIn (SLOAD 1)
    ...
    178:         if (address(guestlist) != address(0)) { //@audit gas: should cache guestlist (SLOAD 1)
    179:             require(guestlist.authorized(msg.sender, _proof), "not authorized"); //@audit gas: should use cached guestlist (SLOAD 2)
    180:         }
    ...
    198:         totalTokenIn = totalTokenIn + _tokenInAmount;  //@audit gas: should use cached totalTokenIn (SLOAD 2)

[](#g-10-knightingroundgettokeninlimitleft-totaltokenin-and-tokeninlimit-should-get-cached--l250-should-be-unchecked-due-to-l249)\[G-10\] `KnightingRound.getTokenInLimitLeft()`: `totalTokenIn` and `tokenInLimit` should get cached + L250 should be unchecked due to L249
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: KnightingRound.sol
    248:     function getTokenInLimitLeft() external view returns (uint256 limitLeft_) {
    249:         if (totalTokenIn < tokenInLimit) { //@audit gas: should cache totalTokenIn (SLOAD 1) and tokenInLimit (SLOAD 1)
    250:             limitLeft_ = tokenInLimit - totalTokenIn; //@audit gas: should be unchecked due to L249  //@audit gas: should use cached totalTokenIn (SLOAD 2) and tokenInLimit (SLOAD 2)
    251:         }
    252:     }

[](#g-11-stakedcitadeldeposit-use-calldata-instead-of-memory)\[G-11\] `StakedCitadel.deposit()`: Use `calldata` instead of `memory`
-----------------------------------------------------------------------------------------------------------------------------------

When arguments are read-only on external functions, the data location should be `calldata`:

    File: StakedCitadel.sol
    319:     function deposit(uint256 _amount, bytes32[] memory proof) //@audit gas: should be calldata instead of memory
    320:         external
    321:         whenNotPaused
    322:     {
    323:         _depositWithAuthorization(_amount, proof);
    324:     }

[](#g-12-stakedcitadeldepositall-use-calldata-instead-of-memory)\[G-12\] `StakedCitadel.depositAll()`: Use `calldata` instead of `memory`
-----------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tag:

    File: StakedCitadel.sol
    319:     function deposit(uint256 _amount, bytes32[] memory proof) //@audit gas: should be calldata instead of memory
    320:         external
    321:         whenNotPaused
    322:     {
    323:         _depositWithAuthorization(_amount, proof);
    324:     }

[](#g-13-stakedcitadelsetstrategy-strategy-should-get-cached)\[G-13\] `StakedCitadel.setStrategy()`: `strategy` should get cached
---------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: StakedCitadel.sol
    500:     function setStrategy(address _strategy) external whenNotPaused {
    ...
    505:         if (strategy != address(0)) { //@audit gas: should cache strategy (SLOAD 1)
    506:             require(
    507:                 IStrategy(strategy).balanceOf() == 0, //@audit gas: should use cached strategy (SLOAD 2)

[](#g-14-stakedcitadelearn-strategy-should-get-cached)\[G-14\] `StakedCitadel.earn()`: `strategy` should get cached
-------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: StakedCitadel.sol
    717:     function earn() external {
    ...
    722:         token.safeTransfer(strategy, _bal); //@audit gas: should cache strategy (SLOAD 1)
    723:         IStrategy(strategy).earn();//@audit gas: should use cached strategy (SLOAD 2)
    724:     }

[](#g-15-stakedcitadel_depositfor-token-should-get-cached)\[G-15\] `StakedCitadel._depositFor()`: `token` should get cached
---------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: StakedCitadel.sol
    764:     function _depositFor(address _recipient, uint256 _amount)
    ...
    773:         uint256 _before = token.balanceOf(address(this)); //@audit gas: should cache token (SLOAD 1)
    774:         token.safeTransferFrom(msg.sender, address(this), _amount); //@audit gas: should use cached token (SLOAD 2)
    775:         uint256 _after = token.balanceOf(address(this));//@audit gas: should use cached token (SLOAD 3)

[](#g-16-stakedcitadel_depositfor-l776-should-be-unchecked-due-to-l773-l775)\[G-16\] `StakedCitadel._depositFor()`: L776 should be unchecked due to L773-L775
-------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: StakedCitadel.sol
    764:     function _depositFor(address _recipient, uint256 _amount)
    ...
    773:         uint256 _before = token.balanceOf(address(this)); 
    774:         token.safeTransferFrom(msg.sender, address(this), _amount); 
    775:         uint256 _after = token.balanceOf(address(this));
    776:         _mintSharesFor(_recipient, _after - _before, _pool); 
    777:     }

[](#g-17-stakedcitadel_depositforwithauthorization-guestlist-should-get-cached)\[G-17\] `StakedCitadel._depositForWithAuthorization()`: `guestList` should get cached
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: StakedCitadel.sol
    788:     function _depositForWithAuthorization(
    ...
    793:         if (address(guestList) != address(0)) {//@audit gas: should cache guestList (SLOAD 1)
    794:             require(
    795:                 guestList.authorized(_recipient, _amount, proof), //@audit gas: should use cached guestList (SLOAD 2)

[](#g-18-stakedcitadel_withdraw-token-and-vesting-should-get-cached)\[G-18\] `StakedCitadel._withdraw()`: `token` and `vesting` should get cached
-------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: StakedCitadel.sol
    808:     function _withdraw(uint256 _shares) internal nonReentrant {
    ...
    815:         uint256 b = token.balanceOf(address(this)); //@audit gas: should cache token (SLOAD 1)
    ...
    819:             uint256 _after = token.balanceOf(address(this)); //@audit gas: should use cached token (SLOAD 2)
    ...
    830:         IVesting(vesting).setupVesting(msg.sender, _amount, block.timestamp); //@audit gas: should cache vesting (SLOAD 1)
    831:         token.safeTransfer(vesting, _amount);  //@audit gas: should use cached token (SLOAD 3) //@audit gas: should use cached vesting (SLOAD 2)

[](#g-19-stakedcitadel_withdraw-l817-should-be-unchecked-due-to-l816)\[G-19\] `StakedCitadel._withdraw()`: L817 should be unchecked due to L816
-----------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tag:

    File: StakedCitadel.sol
    808:     function _withdraw(uint256 _shares) internal nonReentrant {
    ...
    816:         if (b < r) {
    817:             uint256 _toWithdraw = r - b; 

[](#g-20-stakedcitadellockersol-state-variables-can-be-tightly-packed-to-save-1-storage-slot)\[G-20\] `StakedCitadelLocker.sol`: state variables can be tightly packed to save 1 storage slot
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

From (see `@audit` tags):

    File: StakedCitadelLocker.sol
    109:     uint256 public kickRewardEpochDelay = 4;
    110: 
    111:     //shutdown
    112:     bool public isShutdown = false; //@audit gas: can be tightly packed by being moved after uint8
    113: 
    114:     //erc20-like interface
    115:     string private _name;
    116:     string private _symbol;
    117:     uint8 private _decimals;

to:

       uint256 public kickRewardEpochDelay = 4;
    
       //erc20-like interface
       string private _name;
       string private _symbol;
       uint8 private _decimals;
    
       //shutdown
       bool public isShutdown = false;

[](#g-21-stakedcitadellockertotalsupplyatepoch-use-a-storage-variables-reference-instead-of-repeatedly-fetching-it-epochsi)\[G-21\] `StakedCitadelLocker.totalSupplyAtEpoch()`: Use a storage variable’s reference instead of repeatedly fetching it (`epochs[i]`)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tag:

    File: StakedCitadelLocker.sol
    403:     function totalSupplyAtEpoch(uint256 _epoch) view external returns(uint256 supply) {
    ...
    409:         for (uint i = _epoch; i + 1 != 0; i--) {
    410:             Epoch storage e = epochs[i];
    411:             if (uint256(e.date) <= cutoffEpoch) {
    412:                 break;
    413:             }
    414:             supply = supply.add(epochs[i].supply); //@audit gas: use "e.supply"

[](#g-22-stakedcitadel_withdraw-maximumstake-minimumstake-and-stakingproxy-should-get-cached)\[G-22\] `StakedCitadel._withdraw()`: `maximumStake`, `minimumStake` and `stakingProxy` should get cached
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: StakedCitadelLocker.sol
    747:     function updateStakeRatio(uint256 _offset) internal {
    ...
    760:         uint256 mean = maximumStake.add(minimumStake).div(2); //@audit gas: should cache maximumStake (SLOAD 1) and minimumStake (SLOAD 1)
    761:         uint256 max = maximumStake.add(_offset); //@audit gas: should use cached maximumStake (SLOAD 2)
    762:         uint256 min = MathUpgradeable.min(minimumStake, minimumStake - _offset); //@audit gas: should use cached minimumStake (SLOAD 2 & 3)
    763:         if (ratio > max) {
    ...
    767:         } else if (ratio < min) {
    ...
    770:             stakingToken.safeTransfer(stakingProxy, increase);  //@audit gas: should cache stakingProxy (SLOAD 1)
    771:             IStakingProxy(stakingProxy).stake(); //@audit gas: should use cached stakingProxy (SLOAD 2)
    772:         }
    773:     }

[](#g-23-stakedcitadelvesterclaimablebalance-help-the-optimizer-by-saving-a-storage-variables-reference-instead-of-repeatedly-fetching-it-vestingrecipient)\[G-23\] `StakedCitadelVester.claimableBalance()`: Help the optimizer by saving a storage variable’s reference instead of repeatedly fetching it (`vesting[recipient]`)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

To help the optimizer, declare a `storage` type variable and use it instead of repeatedly fetching the reference in a map or an array.

The effect can be quite significant.

Here, instead of repeatedly calling `vesting[recipient]`, save its reference like this: `VestingParams storage _vestingParams = vesting[recipient]` and use it.

Impacted lines (see `@audit` tags):

    File: StakedCitadelVester.sol
    108:     function claimableBalance(address recipient) public view returns (uint256) {
    109:         uint256 locked = vesting[recipient].lockedAmounts; //@audit gas: help the optimizer by declaring VestingParams storage _vestingParams = vesting[recipient];
    110:         uint256 claimed = vesting[recipient].claimedAmounts; //@audit gas: use suggested _vestingParams
    111:         if (block.timestamp >= vesting[recipient].unlockEnd) { //@audit gas: use suggested _vestingParams
    112:             return locked - claimed;
    113:         }
    114:         return
    115:             ((locked * (block.timestamp - vesting[recipient].unlockBegin)) / //@audit gas: use suggested _vestingParams
    116:                 (vesting[recipient].unlockEnd - //@audit gas: use suggested _vestingParams
    117:                     vesting[recipient].unlockBegin)) - claimed; //@audit gas: use suggested _vestingParams
    118:     }

[](#g-24-stakedcitadelvestervest-help-the-optimizer-by-saving-a-storage-variables-reference-instead-of-repeatedly-fetching-it-vestingrecipient)\[G-24\] `StakedCitadelVester.vest()`: Help the optimizer by saving a storage variable’s reference instead of repeatedly fetching it (`vesting[recipient]`)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Just like in `StakedCitadelVester.claimableBalance()` above:

    File: StakedCitadelVester.sol
    132:     function vest(
    ...
    140:         vesting[recipient].lockedAmounts = //@audit gas: help the optimizer by declaring VestingParams storage _vestingParams = vesting[recipient];
    141:             vesting[recipient].lockedAmounts + //@audit gas: use suggested _vestingParams
    142:             _amount;
    143:         vesting[recipient].unlockBegin = _unlockBegin; //@audit gas: use suggested _vestingParams
    144:         vesting[recipient].unlockEnd = _unlockBegin + vestingDuration; //@audit gas: use suggested _vestingParams
    145: 
    146:         emit Vest(
    147:             recipient,
    148:             vesting[recipient].lockedAmounts, //@audit gas: use suggested _vestingParams
    149:             _unlockBegin,
    150:             vesting[recipient].unlockEnd //@audit gas: use suggested _vestingParams
    151:         );
    152:     }

[](#g-25-supplyschedulegetepochattimestamp-globalstarttimestamp-should-get-cached)\[G-25\] `SupplySchedule.getEpochAtTimestamp()`: `globalStartTimestamp` should get cached
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: SupplySchedule.sol
    55:     function getEpochAtTimestamp(uint256 _timestamp)
    ...
    60:         require(
    61:             globalStartTimestamp > 0, //@audit gas: should cache globalStartTimestamp (SLOAD 1)
    ...
    64:         return (_timestamp - globalStartTimestamp) / epochLength; //@audit gas: should use cached globalStartTimestamp (SLOAD 2)

[](#g-26-supplyschedulegetmintable-l105-l110-should-be-unchecked-due-to-l95-and-l99-l101)\[G-26\] `SupplySchedule.getMintable()`: L105-L110 should be unchecked due to L95 and L99-L101
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: SupplySchedule.sol
    94:         require(
    95:             block.timestamp > lastMintTimestamp,
    96:             "SupplySchedule: already minted up to current block"
    97:         );
    ...
    099:         if (lastMintTimestamp < cachedGlobalStartTimestamp) {
    100:             lastMintTimestamp = cachedGlobalStartTimestamp;
    101:         }
    ...
    105:         uint256 startingEpoch = (lastMintTimestamp - cachedGlobalStartTimestamp) / 
    106:             epochLength;
    107: 
    108:         uint256 endingEpoch = (block.timestamp - cachedGlobalStartTimestamp) / 
    109:             epochLength;
    110: 

[](#g-27-supplyschedulegetmintabledebug-globalstarttimestamp-should-get-cached)\[G-27\] `SupplySchedule.getMintableDebug()`: `globalStartTimestamp` should get cached
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

See `@audit` tags:

    File: SupplySchedule.sol
    178:     function getMintableDebug(uint256 lastMintTimestamp) external {
    179:         require(
    180:             globalStartTimestamp > 0, //@audit gas: should cache globalStartTimestamp (SLOAD 1)
    ...
    183:         require(
    184:             lastMintTimestamp > globalStartTimestamp, //@audit gas: should use cached globalStartTimestamp (SLOAD 2)
    ...
    197:         emit log_named_uint("globalStartTimestamp", globalStartTimestamp);  //@audit gas: should use cached globalStartTimestamp (SLOAD 3)
    ...
    200:         uint256 startingEpoch = (lastMintTimestamp - globalStartTimestamp) / //@audit gas: should use cached globalStartTimestamp (SLOAD 4)
    201:             epochLength;
    ...
    204:         uint256 endingEpoch = (block.timestamp - globalStartTimestamp) / //@audit gas: should use cached globalStartTimestamp (SLOAD 5)
    ...
    208:         for (uint256 i = startingEpoch; i <= endingEpoch; i++) {
    ...
    211:             uint256 epochStartTime = globalStartTimestamp + i * epochLength;  //@audit gas: should use cached globalStartTimestamp (SLOAD 6 + iteration)
    212:             uint256 epochEndTime = globalStartTimestamp + (i + 1) * epochLength; //@audit gas: should use cached globalStartTimestamp (SLOAD 7 + iteration)

[](#g-28-supplyschedulegetmintabledebug-l200-l205-should-be-unchecked-due-to-l184-and-l188)\[G-28\] `SupplySchedule.getMintableDebug()`: L200-L205 should be unchecked due to L184 and L188
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    File: SupplySchedule.sol
    178:     function getMintableDebug(uint256 lastMintTimestamp) external {
    ...
    183:         require(
    184:             lastMintTimestamp > globalStartTimestamp, // gas: should use cached globalStartTimestamp (SLOAD 2)
    185:             "SupplySchedule: attempting to mint before start block"
    186:         );
    187:         require(
    188:             block.timestamp > lastMintTimestamp,
    189:             "SupplySchedule: already minted up to current block"
    190:         );
    ...
    200:         uint256 startingEpoch = (lastMintTimestamp - globalStartTimestamp) / 
    201:             epochLength;
    202:         emit log_named_uint("startingEpoch", startingEpoch);
    203: 
    204:         uint256 endingEpoch = (block.timestamp - globalStartTimestamp) / 
    205:             epochLength;

[](#g-29-no-need-to-explicitly-initialize-variables-with-default-values)\[G-29\] No need to explicitly initialize variables with default values
-----------------------------------------------------------------------------------------------------------------------------------------------

If a variable is not set/initialized, it is assumed to have the default value (`0` for `uint`, `false` for `bool`, `address(0)` for address…). Explicitly initializing it with its default value is an anti-pattern and wastes gas.

As an example: `for (uint256 i = 0; i < numIterations; ++i) {` should be replaced with `for (uint256 i; i < numIterations; ++i) {`

Instances include:

    lib/GlobalAccessControlManaged.sol:47:        bool validRoleFound = false;
    lib/GlobalAccessControlManaged.sol:48:        for (uint256 i = 0; i < roles.length; i++) {
    CitadelMinter.sol:152:        for (uint256 i = 0; i < numPools; i++) {
    CitadelMinter.sol:180:        uint256 lockingAmount = 0;
    CitadelMinter.sol:181:        uint256 stakingAmount = 0;
    CitadelMinter.sol:182:        uint256 fundingAmount = 0;
    Funding.sol:283:        citadelPriceFlag = false;
    MedianOracle.sol:160:        uint256 size = 0;
    MedianOracle.sol:164:        for (uint256 i = 0; i < reportsCount; i++) {
    MedianOracle.sol:226:        for (uint256 i = 0; i < providers.length; i++) {
    StakedCitadelLocker.sol:93:    address public boostPayment = address(0);
    StakedCitadelLocker.sol:94:    uint256 public maximumBoostPayment = 0;
    StakedCitadelLocker.sol:96:    uint256 public nextMaximumBoostPayment = 0;
    StakedCitadelLocker.sol:104:    address public stakingProxy = address(0);
    StakedCitadelLocker.sol:112:    bool public isShutdown = false;
    StakedCitadelLocker.sol:267:        for (uint256 i = 0; i < userRewards.length; i++) {
    StakedCitadelLocker.sol:423:        uint256 min = 0;
    StakedCitadelLocker.sol:428:        for (uint256 i = 0; i < 128; i++) {
    StakedCitadelLocker.sol:634:        uint256 reward = 0;
    StakedCitadelLocker.sol:838:            for (uint i = 0; i < rewardTokens.length; i++) {
    SupplySchedule.sol:103:        uint256 mintable = 0;
    SupplySchedule.sol:192:        uint256 mintable = 0;

I suggest removing explicit initializations for default values.

[](#g-30--0-is-less-efficient-than--0-for-unsigned-integers-with-proof)\[G-30\] `> 0` is less efficient than `!= 0` for unsigned integers (with proof)
------------------------------------------------------------------------------------------------------------------------------------------------------

`!= 0` costs less gas compared to `> 0` for unsigned integers in `require` statements with the optimizer enabled (6 gas)

Proof: While it may seem that `> 0` is cheaper than `!=`, this is only true without the optimizer enabled and outside a require statement. If you enable the optimizer at 10k AND you’re in a `require` statement, this will save gas. You can see this tweet for more proofs: [https://twitter.com/gzeon/status/1485428085885640706](https://twitter.com/gzeon/status/1485428085885640706)

I suggest changing `> 0` with `!= 0` here:

    interfaces/convex/BoringMath.sol:20:        require(b > 0, "BoringMath: division by zero");
    interfaces/convex/BoringMath.sol:102:        require(b > 0, "BoringMath: division by zero");
    interfaces/convex/BoringMath.sol:122:        require(b > 0, "BoringMath: division by zero");
    interfaces/convex/BoringMath.sol:142:        require(b > 0, "BoringMath: division by zero");
    CitadelMinter.sol:343:        require(length > 0, "CitadelMinter: no funding pools");
    Funding.sol:170:        require(_assetAmountIn > 0, "_assetAmountIn must not be 0");
    Funding.sol:322:        require(amount > 0, "nothing to sweep");
    Funding.sol:340:        require(amount > 0, "nothing to claim");
    Funding.sol:424:        require(_citadelPriceInAsset > 0, "citadel price must not be zero");
    Funding.sol:452:        require(_citadelPriceInAsset > 0, "citadel price must not be zero");
    KnightingRound.sol:125:            _saleDuration > 0,
    KnightingRound.sol:129:            _tokenOutPrice > 0,
    KnightingRound.sol:172:        require(_tokenInAmount > 0, "_tokenInAmount should be > 0");
    KnightingRound.sol:215:        require(tokenOutAmount_ > 0, "nothing to claim");
    KnightingRound.sol:313:            _saleDuration > 0,
    KnightingRound.sol:332:            _tokenOutPrice > 0,
    KnightingRound.sol:411:        require(amount > 0, "nothing to sweep");
    MedianOracle.sol:69:        require(minimumProviders_ > 0);
    MedianOracle.sol:109:        require(minimumProviders_ > 0);
    MedianOracle.sol:123:        require(timestamps[0] > 0);
    MedianOracle.sol:143:        require (providerReports[providerAddress][0].timestamp > 0);
    StakedCitadelLocker.sol:178:        require(rewardData[_rewardsToken].lastUpdateTime > 0);
    StakedCitadelLocker.sol:526:        require(_amount > 0, "Cannot stake 0");
    StakedCitadelLocker.sol:681:        require(locked > 0, "no exp locks");
    StakedCitadelLocker.sol:813:        require(_reward > 0, "No reward");
    StakedCitadelVester.sol:138:        require(_amount > 0, "StakedCitadelVester: cannot vest 0");
    SupplySchedule.sol:61:            globalStartTimestamp > 0,
    SupplySchedule.sol:91:            cachedGlobalStartTimestamp > 0,
    SupplySchedule.sol:180:            globalStartTimestamp > 0,

Also, please enable the Optimizer.

[](#g-31--is-cheaper-than-)\[G-31\] `>=` is cheaper than `>`
------------------------------------------------------------

Strict inequalities (`>`) are more expensive than non-strict ones (`>=`). This is due to some supplementary checks (ISZERO, 3 gas)

I suggest using `>=` instead of `>` to avoid some opcodes here:

    interfaces/convex/MathUtil.sol:12:        return a < b ? a : b;

[](#g-32-shift-right-instead-of-dividing-by-2)\[G-32\] Shift Right instead of Dividing by 2
-------------------------------------------------------------------------------------------

A division by 2 can be calculated by shifting one to the right.

While the `DIV` opcode uses 5 gas, the `SHR` opcode only uses 3 gas. Furthermore, Solidity’s division operation also includes a division-by-0 prevention which is bypassed using shifting.

I suggest replacing `/ 2` with `>> 1` here:

    StakedCitadelLocker.sol:431:            uint256 mid = (min + max + 1) / 2;

[](#g-33-an-arrays-length-should-be-cached-to-save-gas-in-for-loops)\[G-33\] An array’s length should be cached to save gas in for-loops
----------------------------------------------------------------------------------------------------------------------------------------

Reading array length at each iteration of the loop takes 6 gas (3 for mload and 3 to place memory\_offset) in the stack.

Caching the array length in the stack saves around 3 gas per iteration.

Here, I suggest storing the array’s length in a variable before the for-loop, and use it instead:

    lib/GlobalAccessControlManaged.sol:48:        for (uint256 i = 0; i < roles.length; i++) {
    StakedCitadelLocker.sol:267:        for (uint256 i = 0; i < userRewards.length; i++) {
    StakedCitadelLocker.sol:459:        for (uint i = nextUnlockIndex; i < locks.length; i++) {
    StakedCitadelLocker.sol:777:        for (uint i; i < rewardTokens.length; i++) {
    StakedCitadelLocker.sol:838:            for (uint i = 0; i < rewardTokens.length; i++) {

[](#g-34-i-costs-less-gas-compared-to-i-or-i--1)\[G-34\] `++i` costs less gas compared to `i++` or `i += 1`
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

    lib/GlobalAccessControlManaged.sol:48:        for (uint256 i = 0; i < roles.length; i++) {
    CitadelMinter.sol:152:        for (uint256 i = 0; i < numPools; i++) {
    MedianOracle.sol:164:        for (uint256 i = 0; i < reportsCount; i++) {
    MedianOracle.sol:226:        for (uint256 i = 0; i < providers.length; i++) {
    StakedCitadelLocker.sol:267:        for (uint256 i = 0; i < userRewards.length; i++) {
    StakedCitadelLocker.sol:296:        for (uint i = nextUnlockIndex; i < locksLength; i++) {
    StakedCitadelLocker.sol:428:        for (uint256 i = 0; i < 128; i++) {
    StakedCitadelLocker.sol:459:        for (uint i = nextUnlockIndex; i < locks.length; i++) {
    StakedCitadelLocker.sol:465:                idx++;
    StakedCitadelLocker.sol:659:            for (uint i = nextUnlockIndex; i < length; i++) {
    StakedCitadelLocker.sol:676:                nextUnlockIndex++;
    StakedCitadelLocker.sol:777:        for (uint i; i < rewardTokens.length; i++) {
    StakedCitadelLocker.sol:838:            for (uint i = 0; i < rewardTokens.length; i++) {
    SupplySchedule.sol:208:        for (uint256 i = startingEpoch; i <= endingEpoch; i++) {

I suggest using `++i` instead of `i++` to increment the value of an uint variable.

This is already done here:

    CitadelMinter.sol:344:        for (uint256 i; i < length; ++i) {

[](#g-35-increments-can-be-unchecked)\[G-35\] Increments can be unchecked
-------------------------------------------------------------------------

In Solidity 0.8+, there’s a default overflow check on unsigned integers. It’s possible to uncheck this in for-loops and save some gas at each iteration, but at the cost of some code readability, as this uncheck cannot be made inline.

[ethereum/solidity#10695](https://github.com/ethereum/solidity/issues/10695)

Instances include:

    lib/GlobalAccessControlManaged.sol:48:        for (uint256 i = 0; i < roles.length; i++) {
    CitadelMinter.sol:152:        for (uint256 i = 0; i < numPools; i++) {
    CitadelMinter.sol:344:        for (uint256 i; i < length; ++i) {
    SupplySchedule.sol:208:        for (uint256 i = startingEpoch; i <= endingEpoch; i++) {

The code would go from:

    for (uint256 i; i < numIterations; i++) {  
     // ...  
    }  

to:

    for (uint256 i; i < numIterations;) {  
     // ...  
     unchecked { ++i; }  
    }  

The risk of overflow is inexistant for a `uint256` here.

This is already done here:

    SupplySchedule.sol:122:            unchecked { ++i; }

[](#g-36-consider-making-some-constants-as-non-public-to-save-gas)\[G-36\] Consider making some constants as non-public to save gas
-----------------------------------------------------------------------------------------------------------------------------------

Reducing from `public` to `private` or `internal` can save gas when a constant isn’t used outside of its contract. I suggest changing the visibility from `public` to `internal` or `private` here:

    lib/GlobalAccessControlManaged.sol:15:    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    lib/GlobalAccessControlManaged.sol:16:    bytes32 public constant UNPAUSER_ROLE = keccak256("UNPAUSER_ROLE");
    CitadelMinter.sol:30:    bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
    CitadelMinter.sol:32:    bytes32 public constant POLICY_OPERATIONS_ROLE =
    CitadelToken.sol:9:    bytes32 public constant CITADEL_MINTER_ROLE =
    Funding.sol:21:    bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
    Funding.sol:23:    bytes32 public constant POLICY_OPERATIONS_ROLE =
    Funding.sol:25:    bytes32 public constant TREASURY_OPERATIONS_ROLE = keccak256("TREASURY_OPERATIONS_ROLE");
    Funding.sol:26:    bytes32 public constant TREASURY_VAULT_ROLE =
    Funding.sol:28:    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");
    Funding.sol:30:    uint256 public constant MAX_BPS = 10000;
    GlobalAccessControl.sol:25:    bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
    GlobalAccessControl.sol:27:    bytes32 public constant TREASURY_GOVERNANCE_ROLE =
    GlobalAccessControl.sol:30:    bytes32 public constant TECH_OPERATIONS_ROLE =
    GlobalAccessControl.sol:32:    bytes32 public constant POLICY_OPERATIONS_ROLE =
    GlobalAccessControl.sol:34:    bytes32 public constant TREASURY_OPERATIONS_ROLE =
    GlobalAccessControl.sol:37:    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");
    GlobalAccessControl.sol:39:    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    GlobalAccessControl.sol:40:    bytes32 public constant UNPAUSER_ROLE = keccak256("UNPAUSER_ROLE");
    GlobalAccessControl.sol:42:    bytes32 public constant BLOCKLIST_MANAGER_ROLE =
    GlobalAccessControl.sol:44:    bytes32 public constant BLOCKLISTED_ROLE = keccak256("BLOCKLISTED_ROLE");
    GlobalAccessControl.sol:46:    bytes32 public constant CITADEL_MINTER_ROLE =
    KnightingRound.sol:19:    bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
    KnightingRound.sol:21:    bytes32 public constant TREASURY_GOVERNANCE_ROLE =
    KnightingRound.sol:24:    bytes32 public constant TECH_OPERATIONS_ROLE =
    KnightingRound.sol:26:    bytes32 public constant TREASURY_OPERATIONS_ROLE =
    MedianOracle.sol:53:    uint256 private constant MAX_REPORT_EXPIRATION_TIME = 520 weeks;
    StakedCitadel.sol:112:    uint256 public constant MAX_BPS = 10_000;
    StakedCitadel.sol:113:    uint256 public constant SECS_PER_YEAR = 31_556_952; // 365.2425 days
    StakedCitadel.sol:115:    uint256 public constant WITHDRAWAL_FEE_HARD_CAP = 200; // Never higher than 2%
    StakedCitadel.sol:116:    uint256 public constant PERFORMANCE_FEE_HARD_CAP = 3_000; // Never higher than 30% // 30% maximum performance fee // We usually do 20, so this is insanely high already
    StakedCitadel.sol:117:    uint256 public constant MANAGEMENT_FEE_HARD_CAP = 200; // Never higher than 2%
    StakedCitadelLocker.sol:70:    uint256 public constant rewardsDuration = 86400; // 1 day
    StakedCitadelLocker.sol:73:    uint256 public constant lockDuration = rewardsDuration * 7 * 21; // 21 weeks
    StakedCitadelLocker.sol:98:    uint256 public constant denominator = 10000;
    StakedCitadelLocker.sol:105:    uint256 public constant stakeOffsetOnLock = 500; //allow broader range for staking when depositing
    StakedCitadelVester.sol:20:    bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
    StakedCitadelVester.sol:34:    uint256 public constant INITIAL_VESTING_DURATION = 86400 * 21; // 21 days of vesting
    SupplySchedule.sol:22:    bytes32 public constant CONTRACT_GOVERNANCE_ROLE =
    SupplySchedule.sol:25:    uint256 public constant epochLength = 21 days;

[](#g-37-reduce-the-size-of-error-messages-long-revert-strings)\[G-37\] Reduce the size of error messages (Long revert Strings)
-------------------------------------------------------------------------------------------------------------------------------

Shortening revert strings to fit in 32 bytes will decrease deployment time gas and will decrease runtime gas when the revert condition is met.

Revert strings that are longer than 32 bytes require at least one additional mstore, along with additional overhead for computing memory offset, etc.

Revert strings > 32 bytes:

    lib/GlobalAccessControlManaged.sol:64:            "GAC: invalid-caller-role-or-address"
    lib/SafeERC20.sol:57:            "SafeERC20: approve from non-zero to non-zero allowance"
    lib/SafeERC20.sol:78:            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
    lib/SafeERC20.sol:98:            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    CitadelMinter.sol:301:            "CitadelMinter: Sum of propvalues must be 10000 bps"
    CitadelMinter.sol:321:            "CitadelMinter: last mint timestamp already initialized"
    CitadelMinter.sol:328:            "CitadelMinter: supply schedule start not initialized"
    CitadelMinter.sol:370:            "CitadelMinter: funding pool does not exist for removal"
    CitadelMinter.sol:377:            "CitadelMinter: funding pool already exists"
    Funding.sol:148:            "Funding: citadel price from oracle flagged and pending review"
    Funding.sol:298:            "cannot decrease cap below global sum of assets in"
    Funding.sol:325:            "cannot sweep funding asset, use claimAssetToTreasury()"
    Funding.sol:390:            "Funding: sale recipient should not be zero"
    GlobalAccessControl.sol:118:            "Role string and role do not match"
    KnightingRound.sol:122:            "KnightingRound: start date may not be in the past"
    KnightingRound.sol:126:            "KnightingRound: the sale duration must not be zero"
    KnightingRound.sol:130:            "KnightingRound: the price must not be zero"
    KnightingRound.sol:134:            "KnightingRound: sale recipient should not be zero"
    KnightingRound.sol:273:        require(!finalized, "KnightingRound: already finalized");
    KnightingRound.sol:277:            "KnightingRound: not enough balance"
    KnightingRound.sol:295:            "KnightingRound: start date may not be in the past"
    KnightingRound.sol:297:        require(!finalized, "KnightingRound: already finalized");
    KnightingRound.sol:314:            "KnightingRound: the sale duration must not be zero"
    KnightingRound.sol:316:        require(!finalized, "KnightingRound: already finalized");
    KnightingRound.sol:333:            "KnightingRound: the price must not be zero"
    KnightingRound.sol:351:            "KnightingRound: sale recipient should not be zero"
    KnightingRound.sol:384:        require(!finalized, "KnightingRound: already finalized");
    StakedCitadel.sol:192:            "performanceFeeGovernance too high"
    StakedCitadel.sol:196:            "performanceFeeStrategist too high"
    StakedCitadel.sol:508:                "Please withdrawToVault before changing strat"
    StakedCitadel.sol:537:            "performanceFeeStrategist too high"
    StakedCitadel.sol:632:            "Excessive strategist performance fee"
    StakedCitadel.sol:652:            "Excessive governance performance fee"
    StakedCitadelVester.sol:137:        require(msg.sender == vault, "StakedCitadelVester: only xCTDL vault");
    StakedCitadelVester.sol:138:        require(_amount > 0, "StakedCitadelVester: cannot vest 0");
    SupplySchedule.sol:62:            "SupplySchedule: minting not started"
    SupplySchedule.sol:92:            "SupplySchedule: minting not started"
    SupplySchedule.sol:96:            "SupplySchedule: already minted up to current block"
    SupplySchedule.sol:139:            "SupplySchedule: minting already started"
    SupplySchedule.sol:143:            "SupplySchedule: minting must start at or after current time"
    SupplySchedule.sol:157:            "SupplySchedule: rate already set for given epoch"
    SupplySchedule.sol:181:            "SupplySchedule: minting not started"
    SupplySchedule.sol:185:            "SupplySchedule: attempting to mint before start block"
    SupplySchedule.sol:189:            "SupplySchedule: already minted up to current block"
    SupplySchedule.sol:227:                "total mintable after this iteration", 

I suggest shortening the revert strings to fit in 32 bytes, or using custom errors as described next.

[](#g-38-use-custom-errors-instead-of-revert-strings-to-save-gas)\[G-38\] Use Custom Errors instead of Revert Strings to save Gas
---------------------------------------------------------------------------------------------------------------------------------

Custom errors from Solidity 0.8.4 are cheaper than revert strings (cheaper deployment cost and runtime cost when the revert condition is met)

Source: [https://blog.soliditylang.org/2021/04/21/custom-errors/](https://blog.soliditylang.org/2021/04/21/custom-errors/):

> Starting from [Solidity v0.8.4](https://github.com/ethereum/solidity/releases/tag/v0.8.4), there is a convenient and gas-efficient way to explain to users why an operation failed through the use of custom errors. Until now, you could already use strings to give more information about failures (e.g., `revert("Insufficient funds.");`), but they are rather expensive, especially when it comes to deploy cost, and it is difficult to use dynamic information in them.

Custom errors are defined using the `error` statement, which can be used inside and outside of contracts (including interfaces and libraries).

Instances include:

    interfaces/convex/BoringMath.sol:8:        require((c = a + b) >= b, "BoringMath: Add Overflow");
    interfaces/convex/BoringMath.sol:12:        require((c = a - b) <= a, "BoringMath: Underflow");
    interfaces/convex/BoringMath.sol:16:        require(b == 0 || (c = a * b) / b == a, "BoringMath: Mul Overflow");
    interfaces/convex/BoringMath.sol:20:        require(b > 0, "BoringMath: division by zero");
    interfaces/convex/BoringMath.sol:25:        require(a <= type(uint128).max, "BoringMath: uint128 Overflow");
    interfaces/convex/BoringMath.sol:30:        require(a <= type(uint64).max, "BoringMath: uint64 Overflow");
    interfaces/convex/BoringMath.sol:35:        require(a <= type(uint32).max, "BoringMath: uint32 Overflow");
    interfaces/convex/BoringMath.sol:40:        require(a <= type(uint40).max, "BoringMath: uint40 Overflow");
    interfaces/convex/BoringMath.sol:45:        require(a <= type(uint112).max, "BoringMath: uint112 Overflow");
    interfaces/convex/BoringMath.sol:50:        require(a <= type(uint224).max, "BoringMath: uint224 Overflow");
    interfaces/convex/BoringMath.sol:55:        require(a <= type(uint208).max, "BoringMath: uint208 Overflow");
    interfaces/convex/BoringMath.sol:60:        require(a <= type(uint216).max, "BoringMath: uint216 Overflow");
    interfaces/convex/BoringMath.sol:68:        require((c = a + b) >= b, "BoringMath: Add Overflow");
    interfaces/convex/BoringMath.sol:72:        require((c = a - b) <= a, "BoringMath: Underflow");
    interfaces/convex/BoringMath.sol:79:        require((c = a + b) >= b, "BoringMath: Add Overflow");
    interfaces/convex/BoringMath.sol:83:        require((c = a - b) <= a, "BoringMath: Underflow");
    interfaces/convex/BoringMath.sol:90:        require((c = a + b) >= b, "BoringMath: Add Overflow");
    interfaces/convex/BoringMath.sol:94:        require((c = a - b) <= a, "BoringMath: Underflow");
    interfaces/convex/BoringMath.sol:98:        require(b == 0 || (c = a * b) / b == a, "BoringMath: Mul Overflow");
    interfaces/convex/BoringMath.sol:102:        require(b > 0, "BoringMath: division by zero");
    interfaces/convex/BoringMath.sol:110:        require((c = a + b) >= b, "BoringMath: Add Overflow");
    interfaces/convex/BoringMath.sol:114:        require((c = a - b) <= a, "BoringMath: Underflow");
    interfaces/convex/BoringMath.sol:118:        require(b == 0 || (c = a * b) / b == a, "BoringMath: Mul Overflow");
    interfaces/convex/BoringMath.sol:122:        require(b > 0, "BoringMath: division by zero");
    interfaces/convex/BoringMath.sol:130:        require((c = a + b) >= b, "BoringMath: Add Overflow");
    interfaces/convex/BoringMath.sol:134:        require((c = a - b) <= a, "BoringMath: Underflow");
    interfaces/convex/BoringMath.sol:138:        require(b == 0 || (c = a * b) / b == a, "BoringMath: Mul Overflow");
    interfaces/convex/BoringMath.sol:142:        require(b > 0, "BoringMath: division by zero");
    lib/GlobalAccessControlManaged.sol:41:        require(gac.hasRole(role, msg.sender), "GAC: invalid-caller-role");
    lib/GlobalAccessControlManaged.sol:55:        require(validRoleFound, "GAC: invalid-caller-role");
    lib/GlobalAccessControlManaged.sol:62:        require(
    lib/GlobalAccessControlManaged.sol:71:        require(!gac.paused(), "global-paused");
    lib/GlobalAccessControlManaged.sol:72:        require(!paused(), "local-paused");
    lib/GlobalAccessControlManaged.sol:81:        require(gac.hasRole(PAUSER_ROLE, msg.sender));
    lib/GlobalAccessControlManaged.sol:86:        require(gac.hasRole(UNPAUSER_ROLE, msg.sender));
    lib/SafeERC20.sol:55:        require(
    lib/SafeERC20.sol:78:            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
    lib/SafeERC20.sol:98:            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    lib/SettAccessControl.sol:16:        require(msg.sender == governance, "onlyGovernance");
    lib/SettAccessControl.sol:20:        require(
    lib/SettAccessControl.sol:27:        require(
    CitadelMinter.sol:116:        require(_gac != address(0), "address 0 invalid");
    CitadelMinter.sol:117:        require(_citadelToken != address(0), "address 0 invalid");
    CitadelMinter.sol:118:        require(_xCitadel != address(0), "address 0 invalid");
    CitadelMinter.sol:119:        require(_xCitadelLocker != address(0), "address 0 invalid");
    CitadelMinter.sol:120:        require(_supplySchedule != address(0), "address 0 invalid");
    CitadelMinter.sol:256:        require(
    CitadelMinter.sol:272:            require(_weight <= 10000, "exceed max funding pool weight");
    CitadelMinter.sol:299:        require(
    CitadelMinter.sol:319:        require(
    CitadelMinter.sol:326:        require(
    CitadelMinter.sol:343:        require(length > 0, "CitadelMinter: no funding pools");
    CitadelMinter.sol:368:        require(
    CitadelMinter.sol:375:        require(
    Funding.sol:80:        require(
    Funding.sol:113:        require(
    Funding.sol:117:        require(
    Funding.sol:146:        require(
    Funding.sol:170:        require(_assetAmountIn > 0, "_assetAmountIn must not be 0");
    Funding.sol:171:        require(
    Funding.sol:178:        require(citadelAmount_ >= _minCitadelOut, "minCitadelOut");
    Funding.sol:270:        require(_discount >= funding.minDiscount, "discount < minDiscount");
    Funding.sol:271:        require(_discount <= funding.maxDiscount, "discount > maxDiscount");
    Funding.sol:296:        require(
    Funding.sol:322:        require(amount > 0, "nothing to sweep");
    Funding.sol:323:        require(
    Funding.sol:340:        require(amount > 0, "nothing to claim");
    Funding.sol:361:        require(_maxDiscount < MAX_BPS , "maxDiscount >= MAX_BPS");
    Funding.sol:388:        require(
    Funding.sol:424:        require(_citadelPriceInAsset > 0, "citadel price must not be zero");
    Funding.sol:425:        require(_valid, "oracle data must be valid");
    Funding.sol:452:        require(_citadelPriceInAsset > 0, "citadel price must not be zero");
    GlobalAccessControl.sol:95:        require(hasRole(PAUSER_ROLE, msg.sender), "PAUSER_ROLE");
    GlobalAccessControl.sol<img class="emoji-icon" alt="emoji-100" data-icon="emoji-100" style="display: inline; margin: 0; margin-top: 1px; position: relative; top: 5px; width: 25px" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAMMUlEQVR4Ae3YhXtcx90o4HfOnhVZlpntkMN0nTK3TsrMzPdjZmZmvh8zM5SZuQ04zInMsiVb0kq7e2jmPnBRj11t5HLy/gcz88Px4PaQhwRf5Q6xJQFTViAc9OWV2FVyVc6tq5hEZXlj0zylxxNKzkr0hng7/nMdo6OkQIFkGXnbl95mwn1c1mFvyWWBqxpuq/k13Oz0bOeyeZ5Z8eKaR9a0ARtyPpy4aophfBhdywj7fOGt5ZySrTUziQPoAwyxteDJJc+teXnBUAQEvnML78BQn5M4ArCGUHPhAt9d8LKS9RGBMjCVeMsovz3KD3cZrvkeTFlG3vWFs47xkkfP85zIwxpuj/wWbocxtvV4c8l39NgcgTrQCZzIaNW8MHFRw3vxz7CBrM+mgu/o8uqK1WgCdwf2tbg2510ZWY9rKhb6rDKAvOfMXUS2yLo+T6/4/YK1NVo8OvI23L6D8Q6vKPixPiNIgfnAvowbW3y2zTv7/Ejk+ZE7AXqM1Dx7kVfXrIaMycivXMff30WB9Houx9bIbM3orxKQOL38F52Zv6DVZUfJq0q+q8eaBIj0a9IjCEd4Rs3r+4xAoJPxlgV+LOPoBM0mth/hrJrViVHYSTbPtprvqhhPCFT4pxbveQT9R+AswmHaEYl2ZPhJg1zAk6zcq2iVnNfnG7t8Y8lYIgBSxoEhjvdZt8DVJVcAKuyb4+f6HELTwVb2JM5uCBkjEFnX4qXznJ/IkQKfyXgnDgNEVo9y1QIhUOU0Ocky8twZedI839Fjb814AgAEbsH0LC9oeFpFDoH7Mn43cv8QDUDFeYHNgdkWx6DDpoZXxv8nchr+YIHPIQKsZ0vimQ2txGgiRMvLo5V5Ga+e51t67ImsOsXh+yVvW82JeR5bcw4EOhmf6PG+EUoAmOfKhq2J+cjoYwn72F1wcSJDzHhn4LPj9ACgYSxxViIgS6Sjlpcf9cB8P5fO8aI5XlZyWUNuKZqMzzZcu55Lj3NJTRtwZ+IfRjhpiZK1kTbKRO8+zm7xmooRpECn4V8jBywRyRMTgGw1F7+Bu7Ho9ORvMJh15ImHH+fba66p2BoRaDLm0GpYAyga/jJw/yKvi1yaECgDtxR8whLnsesoayIC7YywwJaKpyWgCdzUsA89S+SUkWlA1mJ3xsiyF5AZTMFQ4vUFL60ZBtyaeG+L4cArGiBmHFvkExez4TiPaVgP2N/i42MsWIoGCTCacW6kU7ARUODtQ0w7hUATKAGpoQgky8gbg6lJiZPYH5hI3Jj4+1V8KOM5JV8PKPCREToFz6w5JwIxcH2bDziFjBMtOhENApdiy/97qTXvi3ScQs3amrMBqeTuPj3LyBcMZoh+4teHmKrZ2OMtuHYdj57juRUtwHzNPyZO9LkmsjWixULgpoK7ndpFGROAAltqzk1AHZhM7A/UlriMsaNcWLELAWWXyf+gbxn5PxhYwkn8LsBP0p7m4Q2PS0ATONjjhnMY6XBBZCwgcGiI+51GyeMj50VkzCXUnA2oA/cPUzmFDmdHri4ZRhOYyum+jGQZ+cusXM1ZFY8omIBAt8W+TfTa7K3ZFAGR2xtudgqbyDs8pWZ7RJteoFfTAnQi/xboOoVFzqt5RgKqFjePM2sA+biVK3gMHhuBhKmGt+Y0NY9NTECgjFzb5SZLnE2G3QXnR4YDArOJuQYQWFzk5i6VJR5Odow1NZsAZeBzgb4B5MHK9djdsDshY7bFuxven9FUXIhRCBxrc7BNbYlIhidENkQE6hbtwASgCUxH5kaIluKynGf1CICy4loUBpCXVuYcdkxxQU07AJMN/4xOzSpsSrQhcKTFcaewQNbieZHNgE7GIoYgULY4PE7hFGa5tOJJCUiBk13umaUygPyIldnOExJXNgjAzAL7YJiAjWj9PxcwY4kNtGseMcMVkREIHMw4FDkPkGE4d2oFGxu2A7oZn8uZ3kg0gHyjlVngUZHdCYF+xtQBClgHDCcCoMgoLFGRJ17YsDEhIPLhjLsjFwJakXEEANhJXvHoWa6pyQHTDX87TNeA8mEP3FlcfJQralYF4N7EO9s0kCylSFQAsJV2j0sWeGZiDAJTkY+1WahpQSJEhgtqAGiz6SQvq9gbESgDdxzlY/PUBpTf6YHbxEsjl0cgJm7t8Y4dVE5tKNACgFlW1XxdlwsTOeBDLfbl7EIDyLBuA/9tHSfaFInRBfYW7K1YCzgWeMduFpAMKL/K4NYQsHmWqyPbINAJ3D3GCQBAAMAliceM089oAqnDI0teWzMMGYcTb9nPPZsZTxwGBOwo+b45ZhKdjLU1j49cCIEC1y/wnwskg5MfM7hxQuA5BefUANyZ8SkAyEiJk9iBVs0VGd/S52osBpqG51WMA8rAf+R8cjfVRm6b5UMZeyMTibGCl9VoEJAAaHBrxr9+gANIBif8oMG9iaHI78zyipq1gSrxW9fzE+gDXM1w4rs7fGvDDgQkJABkgH7GtRXfPcnnkOBRXN7le3u8ODGODAAQUWTcE/jTm/lDFB6g8EcG81Syhp3z/GefPZGQcW2Ln8d/WGIVYxW/1OdlDRuQIwASInotPt3nJ2f5HAqAS2lVnF3yhj6vj2xAQEDKmM74eOLvT/JB9KxAeJvBXMhI4jtn+N6aTYGY+KVZfhWzTmEX6xPPqHh5zSMiGxPtQCfj9sB7Kv5ugftRWuJcWn3GF1nTZ11D3mZrw2xgZoSTLebQt0LhEwazitV4S4fHRYYC70z8/P/gE0hO4ycZX2RjwZqK8chIRtliZojjh5hBtIx9hDHCHoZmqFE7c8LfDRb+4Rg7e3ysYBcWEz+c8RdYNDi/Q0DyFSK83PJ+hXaXR83ynw0bMybxzXinM+c81k5QonuQx7U4F/2aNW3ua3PfOo7NcU6i3Ml9aJw5+T9Z3iRDOZdE8oTAVIt5K7CLbX1297m4oVWz5ijbJkmJ+RaPztiZKBLjOBw5eJSZwI5EdZybRvngBm5C1xnIj1texVDDJWhD5AZMWcZljMyys2BLl2012w9zduBS7Im0IusTrRpQIyEBAhdBCxHQ0K954hy/gfc7A+FTljfBxobfmeWFWEh8W8Vb0QOAKwld1lVsX2RLwzkZD09cUnNpzeYGEQnBaaVAjQBIaLCAk4HhRBH55U/z50hWKP+I5T2bVmIDQotPRG4dpgcAZ5PPsLPi+XhazeNK1tdIlpIySpTI0EGT6GMxcDLQQQCkQA+TQ9ycMVFzuMdnEc7oAgygZihyMVoZ+07zN7+m4SUL/GJFjgCAGiXKQC8wHTja4giG8NkW8wX3d7i7y3Sg2EwEQIJEQkAaJT3ZmcmfbHkZDaaxYYGPTzFtia2kSF3TABrEQDdjMnBTxh2RW6a5bgOziAhokBATsSQhHXBayRdIfq/lXUkv8IEWWWDm72ks8WRmI+8Z5dkl3RY3N0wW3Bo4MMxioApU91HcR/LlJ/y25T2bdsVli7yx4Tew3ykM08bOPrFNt6Y4SQ+VZVzCeEZ7DfOzjGPoLGYOMYYFgMTqnSwiOnNCMpi7GeqwM3AIhRXaQ+sgOyq2VuwNzCVGKi7qsjMxhKGGLKNAnugOcxCrarY0yJka4a5hPrmGT2PeCoQpXzwl2xLbe+zpc2XF+P/u/ZgI7E70kWN9wwQkJAQAZHQxlMgTAiljGpOBD67mb3CTByjc4gvjUlqHuKhmU5eLFtmOsxMbcWHi/EiWEJGQAAkQfH4B6GacwGxiBE3G+0b4A9ziAcoLK7ObdoftfXb12HoDuxJXYWvkipqtEc3nP2AM1IEmsIATWIgcQxMYbzgYqCHQD8zkTGVMR4YTZeSmD3OnFQi/aXAvJU9s6rG54OLEoxJX1VzcsK06zZQXKNELdBIFmsi9gZOBMqPb4jgOtJgpuKumGmPD9dxUUEACyi95F4BnkWNPyTMbHlfyiJJNjaXUgQL9xFxgJnAw52hgMnEiUNzDW2boRaDwZZIbUGQ48S3zvLRmNQAiKvQxnzGZcTjjvsinulw/x5GlX+a7Sbt9+YVPG8wqxvBzc7y2YQIlqoy5wF2BT0c+vMjnxilzYkOzSET0FSq812C2ESLrSn6sZqLPO/vcntPP6QzTayhQ+ioSPuaBGWNLRdZl7pP0EX0VC7/gwS3zIPfQBTx0AQ9yD12AB7mHLsCD3EMX4EHufwJIOEs9kLQJngAAAABJRU5ErkJggg==" title="emoji-100" />        require(hasRole(UNPAUSER_ROLE, msg.sender), "UNPAUSER_ROLE");
    GlobalAccessControl.sol:112:        require(
    GlobalAccessControl.sol:116:        require(
    KnightingRound.sol:120:        require(
    KnightingRound.sol:124:        require(
    KnightingRound.sol:128:        require(
    KnightingRound.sol:132:        require(
    KnightingRound.sol:167:        require(saleStart <= block.timestamp, "KnightingRound: not started");
    KnightingRound.sol:168:        require(
    KnightingRound.sol:172:        require(_tokenInAmount > 0, "_tokenInAmount should be > 0");
    KnightingRound.sol:173:        require(
    KnightingRound.sol:179:            require(guestlist.authorized(msg.sender, _proof), "not authorized");
    KnightingRound.sol:185:            require(
    KnightingRound.sol:210:        require(finalized, "sale not finalized");
    KnightingRound.sol:211:        require(!hasClaimed[msg.sender], "already claimed");
    KnightingRound.sol:215:        require(tokenOutAmount_ > 0, "nothing to claim");
    KnightingRound.sol:273:        require(!finalized, "KnightingRound: already finalized");
    KnightingRound.sol:274:        require(saleEnded(), "KnightingRound: not finished");
    KnightingRound.sol:275:        require(
    KnightingRound.sol:293:        require(
    KnightingRound.sol:297:        require(!finalized, "KnightingRound: already finalized");
    KnightingRound.sol:312:        require(
    KnightingRound.sol:316:        require(!finalized, "KnightingRound: already finalized");
    KnightingRound.sol:331:        require(
    KnightingRound.sol:349:        require(
    KnightingRound.sol:384:        require(!finalized, "KnightingRound: already finalized");
    KnightingRound.sol:411:        require(amount > 0, "nothing to sweep");
    StakedCitadel.sol:180:        require(_token != address(0)); // dev: _token address should not be zero
    StakedCitadel.sol:181:        require(_governance != address(0)); // dev: _governance address should not be zero
    StakedCitadel.sol:182:        require(_keeper != address(0)); // dev: _keeper address should not be zero
    StakedCitadel.sol:183:        require(_guardian != address(0)); // dev: _guardian address should not be zero
    StakedCitadel.sol:184:        require(_treasury != address(0)); // dev: _treasury address should not be zero
    StakedCitadel.sol:185:        require(_strategist != address(0)); // dev: _strategist address should not be zero
    StakedCitadel.sol:186:        require(_badgerTree != address(0)); // dev: _badgerTree address should not be zero
    StakedCitadel.sol:187:        require(_vesting != address(0)); // dev: _vesting address should not be zero
    StakedCitadel.sol:190:        require(
    StakedCitadel.sol:194:        require(
    StakedCitadel.sol:198:        require(
    StakedCitadel.sol:202:        require(
    StakedCitadel.sol:262:        require(
    StakedCitadel.sol:270:        require(msg.sender == strategy, "onlyStrategy");
    StakedCitadel.sol:441:        require(address(token) != _token, "No want");
    StakedCitadel.sol:487:        require(_treasury != address(0), "Address 0");
    StakedCitadel.sol:502:        require(_strategy != address(0), "Address 0");
    StakedCitadel.sol:506:            require(
    StakedCitadel.sol:523:        require(_fees <= WITHDRAWAL_FEE_HARD_CAP, "withdrawalFee too high");
    StakedCitadel.sol:535:        require(
    StakedCitadel.sol:550:        require(_fees <= MANAGEMENT_FEE_HARD_CAP, "managementFee too high");
    StakedCitadel.sol:562:        require(_guardian != address(0), "Address cannot be 0x0");
    StakedCitadel.sol:574:        require(_vesting != address(0), "Address cannot be 0x0");
    StakedCitadel.sol:588:        require(_newToEarnBps <= MAX_BPS, "toEarnBps should be <= MAX_BPS");
    StakedCitadel.sol:613:        require(_withdrawalFee <= maxWithdrawalFee, "Excessive withdrawal fee");
    StakedCitadel.sol:630:        require(
    StakedCitadel.sol:650:        require(
    StakedCitadel.sol:666:        require(_fees <= maxManagementFee, "Excessive management fee");
    StakedCitadel.sol:700:        require(address(token) != _token, "No want");
    StakedCitadel.sol:718:        require(!pausedDeposit, "pausedDeposit"); // dev: deposits are paused, we don't earn as well
    StakedCitadel.sol:768:        require(_recipient != address(0), "Address 0");
    StakedCitadel.sol:769:        require(_amount != 0, "Amount 0");
    StakedCitadel.sol:770:        require(!pausedDeposit, "pausedDeposit"); // dev: deposits are paused
    StakedCitadel.sol:794:            require(
    StakedCitadel.sol:809:        require(_shares != 0, "0 Shares");
    StakedCitadelVester.sol:64:        require(_vestingToken != address(0), "Address zero invalid");
    StakedCitadelVester.sol:65:        require(_vault != address(0), "Address zero invalid");
    StakedCitadelVester.sol:137:        require(msg.sender == vault, "StakedCitadelVester: only xCTDL vault");
    StakedCitadelVester.sol:138:        require(_amount > 0, "StakedCitadelVester: cannot vest 0");
    SupplySchedule.sol:60:        require(
    SupplySchedule.sol:90:        require(
    SupplySchedule.sol:94:        require(
    SupplySchedule.sol:137:        require(
    SupplySchedule.sol:141:        require(
    SupplySchedule.sol:155:        require(
    SupplySchedule.sol:179:        require(
    SupplySchedule.sol:183:        require(
    SupplySchedule.sol:187:        require(

I suggest replacing revert strings with custom errors.

* * *

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .mtk10 { color: #4EC9B0; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }