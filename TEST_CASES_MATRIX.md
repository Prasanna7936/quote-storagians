# Storage Quote Application - Complete Test Cases Matrix

## Test Case Structure for Excel

### Column Headers:
| Test ID | Storage Type | Duration | Space Size | Storage Method | Box Count Range | Box Condition | Item Quantities | Expected Result | Status | Notes |

---

## 1. HOUSEHOLD STORAGE TEST CASES (48 base scenarios)

### 1.1 Duration Variations (4 options)
- 1-3months
- 3-6months  
- 6-12months
- >12months

### 1.2 Item Quantity Scenarios (12 scenarios per duration)
1. **Minimal Items**: 1 small furniture, 1 small appliance, 1 kitchen box
2. **Small Load**: 2 medium furniture, 1 large appliance, 3 boxes mixed
3. **Medium Load**: 1 large furniture, 2 medium appliances, 5 boxes mixed
4. **Large Load**: 1 extra large furniture, 1 large furniture, 2 large appliances, 8 boxes
5. **Extra Large Load**: 2 extra large furniture, 3 large furniture, 2 extra large appliances, 15 boxes
6. **Box Heavy**: 0 furniture, 1 small appliance, 20 boxes mixed
7. **Furniture Heavy**: 5 large furniture, 0 appliances, 2 boxes
8. **Appliance Heavy**: 1 medium furniture, 4 large appliances, 3 boxes
9. **Mixed Large**: 1 extra large furniture, 2 large appliances, 10 boxes
10. **Maximum Load**: 3 extra large furniture, 2 extra large appliances, 25 boxes
11. **Single Item**: 1 medium furniture only
12. **Empty Test**: 0 items (edge case)

**Total Household Tests: 4 durations × 12 scenarios = 48 test cases**

---

## 2. BUSINESS STORAGE TEST CASES (192 base scenarios)

### 2.1 Duration × Space Size Matrix (16 combinations)
| Duration | Compact | Standard | Large | Custom |
|----------|---------|----------|--------|---------|
| 1-3months | ✓ | ✓ | ✓ | ✓ |
| 3-6months | ✓ | ✓ | ✓ | ✓ |
| 6-12months | ✓ | ✓ | ✓ | ✓ |
| >12months | ✓ | ✓ | ✓ | ✓ |

### 2.2 Item Scenarios (12 per duration/space combination)
Same 12 item scenarios as Household Storage

**Total Business Tests: 16 combinations × 12 scenarios = 192 test cases**

---

## 3. DOCUMENT STORAGE TEST CASES (128 scenarios)

### 3.1 Full Combination Matrix
| Duration | Storage Type | Box Count | Box Condition | Total Combinations |
|----------|--------------|-----------|---------------|-------------------|
| 1-3months | Rack | 10-25 | Existing | 1 |
| 1-3months | Rack | 10-25 | Need Fresh | 2 |
| 1-3months | Rack | 26-50 | Existing | 3 |
| 1-3months | Rack | 26-50 | Need Fresh | 4 |
| ... (continue pattern) ... | | | | |

**Calculation: 4 durations × 2 storage types × 4 box ranges × 2 box conditions = 64 test cases**

### 3.2 Edge Cases (Additional 8 tests)
- Minimum configuration (1-3months, Rack, 10-25, Existing)
- Maximum configuration (>12months, Pallet, 100+, Need Fresh)
- Mixed scenarios for boundary testing

**Total Document Tests: 64 + 8 = 72 test cases**

---

## 4. COMPREHENSIVE EXCEL TEST MATRIX

### Sheet 1: Household Storage Tests (48 rows)
```
Test_ID | Storage_Type | Duration | Furniture_XL | Furniture_L | Furniture_M | Furniture_S | Appliance_XL | Appliance_L | Appliance_M | Appliance_S | Box_Luggage | Box_Kitchen | Box_Clothes | Box_Books | Expected_Volume | Expected_Monthly | Expected_Total | Status | Notes
H001 | Household | 1-3months | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | ~70 cft | ~₹175 | ~₹437 | | Minimal load test
H002 | Household | 1-3months | 0 | 0 | 2 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 1 | 0 | ~190 cft | ~₹475 | ~₹1187 | | Small load test
...continue for all 48 scenarios
```

### Sheet 2: Business Storage Tests (192 rows)
```
Test_ID | Storage_Type | Duration | Space_Size | Furniture_XL | Furniture_L | Furniture_M | Furniture_S | Appliance_XL | Appliance_L | Appliance_M | Appliance_S | Box_Luggage | Box_Kitchen | Box_Clothes | Box_Books | Expected_SqFt | Expected_Rate | Expected_Monthly | Expected_Total | Status | Notes
B001 | Business | 1-3months | Compact | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | ~100 | ₹50 | ~₹5000 | ~₹12500 | | Compact minimal
B002 | Business | 1-3months | Standard | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | ~100 | ₹48 | ~₹4800 | ~₹12000 | | Standard minimal
...continue for all 192 scenarios
```

### Sheet 3: Document Storage Tests (72 rows)
```
Test_ID | Storage_Type | Duration | Storage_Method | Box_Count_Range | Box_Condition | Expected_Box_Count | Expected_Rate | Expected_Rental | Expected_Box_Charges | Expected_Total | Status | Notes
D001 | Document | 1-3months | Rack | 10-25 | Existing | 25 | ₹125 | ₹3125 | ₹0 | ₹3125 | | Min rack existing
D002 | Document | 1-3months | Rack | 10-25 | Need Fresh | 25 | ₹125 | ₹3125 | ₹2500 | ₹5625 | | Min rack fresh
D003 | Document | 1-3months | Rack | 26-50 | Existing | 50 | ₹120 | ₹6000 | ₹0 | ₹6000 | | Med rack existing
...continue for all 72 scenarios
```

### Sheet 4: Edge Cases & Error Scenarios (24 rows)
```
Test_ID | Scenario_Type | Description | Input_Data | Expected_Behavior | Status | Notes
E001 | Validation | Empty form submission | All fields empty | Show validation errors | | 
E002 | Validation | Invalid item quantities | Negative numbers | Show error message | |
E003 | Boundary | Maximum items | 999 in each field | Handle gracefully | |
E004 | Boundary | Zero items | All quantities = 0 | Show minimum charge or error | |
...continue for edge cases
```

---

## 5. PRIORITY LEVELS FOR TESTING

### Priority 1 (Critical - 24 tests)
- 1 test per storage type per duration (12 tests)
- Boundary cases (min/max scenarios) (6 tests)  
- Most common user flows (6 tests)

### Priority 2 (High - 48 tests)
- Key combinations for each storage type
- Business critical scenarios

### Priority 3 (Medium - 144 tests)
- Full coverage of business storage
- Extended household scenarios

### Priority 4 (Low - 72 tests)
- Document storage full matrix
- Edge cases and error scenarios

---

## 6. EXPECTED CALCULATIONS TO VERIFY

### Household Storage:
- Volume calculation: Items × Volume_Rates
- Vehicle selection based on total volume
- Labour count based on volume and item rules
- Pickup charges = Material + Labour + Vehicle

### Business Storage:
- Rate lookup from Business_Rate_Matrix
- Area estimation from items
- Monthly rent = Area × Rate_per_SqFt

### Document Storage:
- Rate lookup from Document_Rate_Matrix
- Box rental = Rate × Box_Count
- Fresh box charges = ₹100 × Box_Count (if needed)
- Total = Rental + Box_Charges

---

**Total Test Cases: 48 + 192 + 72 + 24 = 336 comprehensive test scenarios**

Copy this structure into Excel with separate sheets for organized testing!