class Query < ActiveRecord::Base
  attr_accessible :body

  validates :body, uniqueness: true
end
