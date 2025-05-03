// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyMarket {
    struct Property {
        uint256 id;
        address owner;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;

    event PropertyListed(uint256 indexed id, address indexed owner, uint256 price);
    event PropertyPurchased(uint256 indexed id, address indexed previousOwner, address indexed newOwner, uint256 price);

    function listProperty(uint256 _propertyId, uint256 _price) public {
        require(_price > 0, "Price must be greater than 0");
        
        properties[_propertyId] = Property({
            id: _propertyId,
            owner: msg.sender,
            price: _price,
            isForSale: true
        });

        emit PropertyListed(_propertyId, msg.sender, _price);
    }

    function purchaseProperty(uint256 _propertyId) public payable {
        Property storage property = properties[_propertyId];
        require(property.isForSale, "Property is not for sale");
        require(msg.value >= property.price, "Insufficient payment");
        require(msg.sender != property.owner, "Owner cannot buy their own property");

        address previousOwner = property.owner;
        uint256 price = property.price;

        // Update property details
        property.owner = msg.sender;
        property.isForSale = false;

        // Transfer payment to previous owner
        (bool sent, ) = previousOwner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit PropertyPurchased(_propertyId, previousOwner, msg.sender, price);
    }

    function getProperty(uint256 _propertyId) public view returns (
        uint256 id,
        address owner,
        uint256 price,
        bool isForSale
    ) {
        Property memory property = properties[_propertyId];
        return (
            property.id,
            property.owner,
            property.price,
            property.isForSale
        );
    }
} 