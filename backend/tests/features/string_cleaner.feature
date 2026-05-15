@part2
Feature: Exam - Backend part.2
  Responsible to validade StringCleaner Class

  @scope
  Scenario Outline: Splitting a string with markers and getting the first part
    Given the input string is <string>
    And then markers are <markers>
    Then the expected result is: <result>

    Examples:
      | string                                             | markers              | result                         |
      | "bananas, tomates # e ventiladores"                | ['#', '!']           | "bananas, tomates"             |
      | "o rato roeu a roupa $ do rei % de roma"           | ['%', '!']           | "o rato roeu a roupa $ do rei" |
      | "the quick brown fox & jumped over * the lazy dog" | ['&', '*', '%', '!'] | "the quick brown fox"          |

  @extra-scope
  Scenario Outline: FAILURE SCENARIOS - Splitting a string with markers and getting the first part
    Given the input string is <string>
    And then markers are <markers>
    Then the expected result is: <result>

    Examples:
      | string                                             | markers              | result                         |
      | ""                                                 | ['&', '*', '%', '!'] | "Invalid Inputs"               |
      | "the quick brown fox & jumped over * the lazy dog" | []                   | "Invalid Inputs"               |